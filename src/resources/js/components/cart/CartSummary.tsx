import React from "react";
import { Link } from "react-router-dom";

interface CartSummaryProps {
    subtotal?: number;
    total?: number;
    onCheckout?: () => void;
    checkoutHref?: string;
    title?: string;
    subtotalLabel?: string;
    totalLabel?: string;
    checkoutText?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
    subtotal = 454.98,
    total = 454.98,
    checkoutHref = "/checkout",
    onCheckout,
    title = "Cart Total",
    subtotalLabel = "Subtotal",
    totalLabel = "Total",
    checkoutText = "PROCEED TO CHECKOUT",
}) => {
    const priceFormatter = new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 0,
    });

    const handleCheckout = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onCheckout?.();

        if (onCheckout) {
            event.preventDefault();
        }
    };

    return (
        <div className="shoping__checkout">
            <h6>{title}</h6>
            <ul>
                <li>
                    {subtotalLabel}{" "}
                    <span>{`${priceFormatter.format(subtotal)}đ`}</span>
                </li>
                <li>
                    {totalLabel}{" "}
                    <span>{`${priceFormatter.format(total)}đ`}</span>
                </li>
            </ul>
            <Link
                to={checkoutHref}
                className="primary-btn"
                onClick={handleCheckout}
            >
                {checkoutText}
            </Link>
        </div>
    );
};

export default CartSummary;
