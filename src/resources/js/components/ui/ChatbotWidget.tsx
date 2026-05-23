import React, {
    FormEvent,
    KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProductCard from "@/components/ui/ProductCard";
import { PATHS } from "@/router/paths";

type ChatRole = "user" | "assistant";

type ProductSuggestion = {
    id: string;
    title: string;
    price: string;
    image: string;
    link: string;
    oldPrice?: string | null;
    onSale?: boolean;
};

type ProductDetailWidget = {
    id: string;
    title: string;
    price: string;
    image: string;
    link: string;
    description?: string;
    inventory?: number;
    rating?: number;
    reviews?: number;
};

type CheckoutWidget = {
    order_id: number;
    momo_order_id: string;
    status?: string;
    status_label?: string;
    total: number;
    address: string;
    note?: string;
    items_count?: number;
    payUrl: string;
};

type ChatMessage = {
    role: ChatRole;
    content: string;
    products?: ProductSuggestion[];
    productDetail?: ProductDetailWidget | null;
    checkout?: CheckoutWidget | null;
};

type StreamEventPayload = {
    content?: string;
    tool_name?: string;
    tool_result?: string;
};

type ProductResultPayload = {
    summary?: string;
    products?: Array<Partial<ProductSuggestion>>;
};

type ProductInfoResultPayload = {
    summary?: string;
    product?: Partial<ProductDetailWidget> | null;
    error?: string;
};

type CheckoutResultPayload = {
    summary?: string;
    error?: string;
    checkout?: Partial<CheckoutWidget>;
};

const initialMessages: ChatMessage[] = [
    {
        role: "assistant",
        content:
            "Xin chào! Tôi là trợ lý Ogani. Bạn cần tư vấn sản phẩm, đơn hàng hay chính sách đổi trả?",
    },
];

const defaultProductImage = "/img/product/product-1.jpg";

const normalizeImagePath = (path?: string | null) => {
    if (!path) {
        return defaultProductImage;
    }

    if (
        path.startsWith("/") ||
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:")
    ) {
        return path;
    }

    return `/${path.replace(/^\/+/, "")}`;
};

const parseProductResult = (value: string): ProductSuggestion[] => {
    try {
        const parsed = JSON.parse(value) as
            | ProductResultPayload
            | ProductSuggestion[];

        const products = Array.isArray(parsed)
            ? parsed
            : (parsed.products ?? []);

        return products
            .map((product, index) => ({
                id: String(product.id ?? index),
                title: String(product.title ?? "Sản phẩm"),
                price: String(product.price ?? ""),
                image: normalizeImagePath(product.image),
                link: String(product.link ?? PATHS.HOME),
                oldPrice: product.oldPrice ?? null,
                onSale: Boolean(product.onSale),
            }))
            .filter((product) => product.title.trim().length > 0);
    } catch {
        return [];
    }
};

const parseProductInfoResult = (value: string): ProductDetailWidget | null => {
    try {
        const parsed = JSON.parse(value) as ProductInfoResultPayload;
        const product = parsed.product;

        if (!product?.id) {
            return null;
        }

        return {
            id: String(product.id),
            title: String(product.title ?? "Sản phẩm"),
            price: String(product.price ?? ""),
            image: normalizeImagePath(product.image),
            link: String(product.link ?? PATHS.HOME),
            description: String(product.description ?? ""),
            inventory:
                typeof product.inventory === "number"
                    ? product.inventory
                    : undefined,
            rating:
                typeof product.rating === "number" ? product.rating : undefined,
            reviews:
                typeof product.reviews === "number"
                    ? product.reviews
                    : undefined,
        };
    } catch {
        return null;
    }
};

const parseCheckoutResult = (value: string): CheckoutWidget | null => {
    try {
        const parsed = JSON.parse(value) as CheckoutResultPayload;
        const checkout = parsed.checkout;

        if (
            !checkout?.order_id ||
            !checkout?.momo_order_id ||
            !checkout.payUrl
        ) {
            return null;
        }

        return {
            order_id: Number(checkout.order_id),
            momo_order_id: String(checkout.momo_order_id),
            status: String(checkout.status ?? ""),
            status_label: String(checkout.status_label ?? ""),
            total: Number(checkout.total ?? 0),
            address: String(checkout.address ?? ""),
            note: String(checkout.note ?? ""),
            items_count:
                typeof checkout.items_count === "number"
                    ? checkout.items_count
                    : undefined,
            payUrl: String(checkout.payUrl),
        };
    } catch {
        return null;
    }
};

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
});

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
                            } else if (eventType === "tool_result") {
                                if (
                                    parsed.tool_name === "search_products" &&
                                    parsed.tool_result
                                ) {
                                    const productResult = JSON.parse(
                                        parsed.tool_result,
                                    ) as ProductResultPayload;

                                    const products = parseProductResult(
                                        parsed.tool_result,
                                    );

                                    setMessages((current) => {
                                        const updated = [...current];
                                        const lastMessage =
                                            updated[updated.length - 1];

                                        if (lastMessage?.role === "assistant") {
                                            lastMessage.content =
                                                productResult.summary ??
                                                lastMessage.content;
                                            lastMessage.products = products;
                                        }

                                        return updated;
                                    });
                                }

                                if (
                                    parsed.tool_name === "get_product_info" &&
                                    parsed.tool_result
                                ) {
                                    const productInfo = JSON.parse(
                                        parsed.tool_result,
                                    ) as ProductInfoResultPayload;
                                    const detail = parseProductInfoResult(
                                        parsed.tool_result,
                                    );

                                    setMessages((current) => {
                                        const updated = [...current];
                                        const lastMessage =
                                            updated[updated.length - 1];

                                        if (lastMessage?.role === "assistant") {
                                            lastMessage.content =
                                                productInfo.summary ??
                                                productInfo.error ??
                                                lastMessage.content;
                                            lastMessage.productDetail = detail;
                                        }

                                        return updated;
                                    });
                                }

                                if (
                                    parsed.tool_name ===
                                        "create_momo_checkout" &&
                                    parsed.tool_result
                                ) {
                                    const checkoutResult = JSON.parse(
                                        parsed.tool_result,
                                    ) as CheckoutResultPayload;
                                    const checkout = parseCheckoutResult(
                                        parsed.tool_result,
                                    );

                                    setMessages((current) => {
                                        const updated = [...current];
                                        const lastMessage =
                                            updated[updated.length - 1];

                                        if (lastMessage?.role === "assistant") {
                                            lastMessage.content =
                                                checkoutResult.summary ??
                                                checkoutResult.error ??
                                                lastMessage.content;
                                            lastMessage.checkout = checkout;
                                        }

                                        return updated;
                                    });
                                }

                                setActiveToolName(null);
                            } else if (parsed.content) {
                                setMessages((current) => {
                                    const updated = [...current];
                                    const lastMessage =
                                        updated[updated.length - 1];

                                    if (
                                        lastMessage?.role === "assistant" &&
                                        !lastMessage.products?.length
                                    ) {
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
                                    <>
                                        {message.content ? (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        ) : isSending &&
                                          index === messages.length - 1 &&
                                          !message.products?.length ? (
                                            <div className="chatbot-widget__assistant-status">
                                                {activeToolName ? (
                                                    <span className="chatbot-widget__tool-status">
                                                        Đang gọi:{" "}
                                                        {activeToolName}
                                                    </span>
                                                ) : (
                                                    <span className="chatbot-widget__typing-status">
                                                        Đang trả lời...
                                                    </span>
                                                )}
                                            </div>
                                        ) : null}

                                        {message.products?.length ? (
                                            <div className="chatbot-widget__products">
                                                {message.products.map(
                                                    (product) => (
                                                        <div
                                                            key={product.id}
                                                            className="chatbot-widget__product"
                                                        >
                                                            <ProductCard
                                                                productId={
                                                                    product.id
                                                                }
                                                                image={
                                                                    product.image
                                                                }
                                                                title={
                                                                    product.title
                                                                }
                                                                price={
                                                                    product.price
                                                                }
                                                                oldPrice={
                                                                    product.oldPrice ??
                                                                    undefined
                                                                }
                                                                onSale={
                                                                    product.onSale
                                                                }
                                                                link={
                                                                    product.link
                                                                }
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : null}

                                        {message.productDetail ? (
                                            <div className="chatbot-widget__detail-card">
                                                <div className="chatbot-widget__detail-media">
                                                    <img
                                                        src={
                                                            message
                                                                .productDetail
                                                                .image
                                                        }
                                                        alt={
                                                            message
                                                                .productDetail
                                                                .title
                                                        }
                                                    />
                                                </div>

                                                <div className="chatbot-widget__detail-body">
                                                    <h5>
                                                        {
                                                            message
                                                                .productDetail
                                                                .title
                                                        }
                                                    </h5>
                                                    <p className="chatbot-widget__detail-price">
                                                        {
                                                            message
                                                                .productDetail
                                                                .price
                                                        }
                                                    </p>

                                                    {message.productDetail
                                                        .description ? (
                                                        <p className="chatbot-widget__detail-desc">
                                                            {
                                                                message
                                                                    .productDetail
                                                                    .description
                                                            }
                                                        </p>
                                                    ) : null}

                                                    <div className="chatbot-widget__detail-meta">
                                                        {typeof message
                                                            .productDetail
                                                            .inventory ===
                                                        "number" ? (
                                                            <span>
                                                                Tồn kho:{" "}
                                                                {
                                                                    message
                                                                        .productDetail
                                                                        .inventory
                                                                }
                                                            </span>
                                                        ) : null}

                                                        {typeof message
                                                            .productDetail
                                                            .rating ===
                                                        "number" ? (
                                                            <span>
                                                                Đánh giá:{" "}
                                                                {message.productDetail.rating.toFixed(
                                                                    1,
                                                                )}
                                                            </span>
                                                        ) : null}

                                                        {typeof message
                                                            .productDetail
                                                            .reviews ===
                                                        "number" ? (
                                                            <span>
                                                                Lượt review:{" "}
                                                                {
                                                                    message
                                                                        .productDetail
                                                                        .reviews
                                                                }
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    <a
                                                        className="chatbot-widget__action-btn"
                                                        href={
                                                            message
                                                                .productDetail
                                                                .link
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Xem chi tiết sản phẩm
                                                    </a>
                                                </div>
                                            </div>
                                        ) : null}

                                        {message.checkout ? (
                                            <div className="chatbot-widget__checkout-card">
                                                <h5>
                                                    Đơn hàng #
                                                    {message.checkout.order_id}
                                                </h5>
                                                <p>
                                                    Mã MoMo:{" "}
                                                    {
                                                        message.checkout
                                                            .momo_order_id
                                                    }
                                                </p>
                                                <p>
                                                    Trạng thái:{" "}
                                                    {message.checkout
                                                        .status_label ||
                                                        message.checkout
                                                            .status ||
                                                        "Chờ thanh toán"}
                                                </p>
                                                <p>
                                                    Tổng tiền:{" "}
                                                    {currencyFormatter.format(
                                                        message.checkout.total,
                                                    )}
                                                    đ
                                                </p>
                                                <p>
                                                    Địa chỉ:{" "}
                                                    {message.checkout.address}
                                                </p>
                                                {message.checkout.note ? (
                                                    <p>
                                                        Ghi chú:{" "}
                                                        {message.checkout.note}
                                                    </p>
                                                ) : null}
                                                {typeof message.checkout
                                                    .items_count ===
                                                "number" ? (
                                                    <p>
                                                        Số sản phẩm:{" "}
                                                        {
                                                            message.checkout
                                                                .items_count
                                                        }
                                                    </p>
                                                ) : null}

                                                <a
                                                    className="chatbot-widget__action-btn chatbot-widget__action-btn--pay"
                                                    href={
                                                        message.checkout.payUrl
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Thanh toán ngay qua MoMo
                                                </a>
                                            </div>
                                        ) : null}
                                    </>
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
