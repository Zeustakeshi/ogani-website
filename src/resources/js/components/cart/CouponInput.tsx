import React, { useState } from "react";
import Button from "../ui/Button";

interface CouponInputProps {
    onApply?: (code: string) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({ onApply }) => {
    const [code, setCode] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApply?.(code);
    };

    return (
        <div className="coupon__code">
            <h6>Discount Codes</h6>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your coupon"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button type="submit">APPLY COUPON</Button>
            </form>
        </div>
    );
};

export default CouponInput;
