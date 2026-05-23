import React, {
    FormEvent,
    KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatRole = "user" | "assistant";

type ChatMessage = {
    role: ChatRole;
    content: string;
};

type StreamEventPayload = {
    content?: string;
    tool_name?: string;
};

const initialMessages: ChatMessage[] = [
    {
        role: "assistant",
        content:
            "Xin chào! Tôi là trợ lý Ogani. Bạn cần tư vấn sản phẩm, đơn hàng hay chính sách đổi trả?",
    },
];

const suggestedPrompts = [
    "Tôi muốn tìm áo thun nam",
    "Shop có giao hàng toàn quốc không?",
    "Làm sao kiểm tra đơn hàng?",
];

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [activeToolName, setActiveToolName] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [isOpen, messages]);

    const sendMessage = async (text?: string) => {
        const content = (text ?? inputValue).trim();

        if (!content || isSending) {
            return;
        }

        const nextMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content },
            { role: "assistant", content: "" },
        ];

        setMessages(nextMessages);
        setInputValue("");
        setIsSending(true);

        try {
            const response = await fetch("/api/chatbot/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream, application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include",
                body: JSON.stringify({
                    messages: nextMessages.filter((message) => message.content),
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error("Request failed");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let finished = false;

            while (!finished) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });

                let separatorIndex = buffer.indexOf("\n\n");

                while (separatorIndex !== -1) {
                    const rawEvent = buffer.slice(0, separatorIndex).trim();
                    buffer = buffer.slice(separatorIndex + 2);

                    if (rawEvent.length > 0) {
                        const lines = rawEvent.split("\n");
                        const dataLine = lines.find((line) =>
                            line.startsWith("data: "),
                        );
                        const eventLine = lines.find((line) =>
                            line.startsWith("event: "),
                        );

                        if (dataLine) {
                            const data = dataLine.slice(6);
                            const eventType = eventLine
                                ? eventLine.slice(7).trim()
                                : "";

                            if (data === "[DONE]") {
                                finished = true;
                                break;
                            }

                            const parsed = JSON.parse(
                                data,
                            ) as StreamEventPayload;

                            if (eventType === "tool_call") {
                                setActiveToolName(parsed.tool_name ?? null);
                            } else if (parsed.content) {
                                setMessages((current) => {
                                    const updated = [...current];
                                    const lastMessage =
                                        updated[updated.length - 1];

                                    if (lastMessage?.role === "assistant") {
                                        lastMessage.content += parsed.content;
                                    }

                                    return updated;
                                });
                            }
                        }
                    }

                    separatorIndex = buffer.indexOf("\n\n");
                }
            }
        } catch {
            setMessages((current) => {
                const updated = [...current];
                const lastMessage = updated[updated.length - 1];

                if (lastMessage?.role === "assistant") {
                    lastMessage.content =
                        "Xin lỗi, hiện tại tôi chưa thể phản hồi. Vui lòng thử lại sau.";
                }

                return updated;
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await sendMessage();
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            await sendMessage();
        }
    };

    return (
        <div className="chatbot-widget">
            {isOpen && <div className="chatbot-widget__backdrop" />}

            {isOpen && (
                <section
                    className={`chatbot-widget__panel ${
                        isExpanded ? "chatbot-widget__panel--expanded" : ""
                    }`}
                    aria-label="Chatbot Ogani"
                >
                    <div className="chatbot-widget__controls">
                        <button
                            type="button"
                            className="chatbot-widget__control"
                            onClick={() => setIsExpanded((current) => !current)}
                            aria-label={
                                isExpanded
                                    ? "Thu nhỏ chatbot"
                                    : "Phóng to chatbot"
                            }
                        >
                            <i
                                className={`fa ${
                                    isExpanded ? "fa-compress" : "fa-expand"
                                }`}
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            className="chatbot-widget__control"
                            onClick={() => {
                                setIsExpanded(false);
                                setIsOpen(false);
                            }}
                            aria-label="Đóng chatbot"
                        >
                            <i className="fa fa-times" aria-hidden="true" />
                        </button>
                    </div>

                    <div
                        className="chatbot-widget__messages"
                        role="log"
                        aria-live="polite"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`chatbot-widget__message chatbot-widget__message--${message.role}`}
                            >
                                {message.role === "assistant" ? (
                                    message.content ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    ) : isSending &&
                                      index === messages.length - 1 ? (
                                        <div className="chatbot-widget__assistant-status">
                                            {activeToolName ? (
                                                <span className="chatbot-widget__tool-status">
                                                    Đang gọi: {activeToolName}
                                                </span>
                                            ) : (
                                                <span className="chatbot-widget__typing-status">
                                                    Đang trả lời...
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        ""
                                    )
                                ) : (
                                    message.content
                                )}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <form
                        className="chatbot-widget__composer"
                        onSubmit={handleSubmit}
                    >
                        <div className="chatbot-widget__input-row">
                            <textarea
                                value={inputValue}
                                onChange={(event) =>
                                    setInputValue(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập tin nhắn..."
                                rows={2}
                                disabled={isSending}
                            />

                            <button
                                type="submit"
                                className="chatbot-widget__send"
                                disabled={isSending}
                            >
                                <i
                                    className="fa fa-paper-plane"
                                    aria-hidden="true"
                                />
                                <span>{isSending ? "Đang gửi..." : "Gửi"}</span>
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <button
                type="button"
                className="chatbot-widget__trigger"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? "Ẩn chatbot" : "Mở chatbot"}
                aria-expanded={isOpen}
            >
                <i className="fa fa-comments" aria-hidden="true" />
            </button>
        </div>
    );
}
