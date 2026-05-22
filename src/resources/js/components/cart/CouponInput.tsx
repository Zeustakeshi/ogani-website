import React, { useState } from "react";
import Button from "../ui/Button";

interface CouponInputProps {
    onApply?: (code: string) => void;
    isApplying?: boolean;
    feedbackMessage?: string | null;
    feedbackTone?: "success" | "error" | "info" | null;
}

const CouponInput: React.FC<CouponInputProps> = ({
    onApply,
    isApplying = false,
    feedbackMessage,
    feedbackTone,
}) => {
    const [code, setCode] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApply?.(code.trim().toUpperCase());
    };

    return (
        <div className="shoping__discount">
            <h6>Discount Codes</h6>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your coupon code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <Button type="submit" disabled={isApplying}>
                    {isApplying ? "APPLYING..." : "APPLY COUPON"}
                </Button>
            </form>
            {feedbackMessage ? (
                <p
                    style={{
                        marginTop: 12,
                        marginBottom: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color:
                            feedbackTone === "success"
                                ? "#4f7d1f"
                                : feedbackTone === "error"
                                  ? "#c62828"
                                  : "#6f6f6f",
                    }}
                >
                    {feedbackMessage}
                </p>
            ) : null}
        </div>
    );
};

export default CouponInput;
