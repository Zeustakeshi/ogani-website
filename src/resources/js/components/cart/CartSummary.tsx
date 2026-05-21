import React from "react";
import { Link } from "react-router-dom";

interface CartSummaryProps {
    subtotal?: number;
    total?: number;
    onCheckout?: () => void;
    checkoutHref?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
    subtotal = 454.98,
    total = 454.98,
    checkoutHref = "/checkout",
    onCheckout,
}) => {
    const handleCheckout = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onCheckout?.();

        if (onCheckout) {
            event.preventDefault();
        }
    };

    return (
        <div className="shoping__checkout">
            <h6>Cart Total</h6>
            <ul>
                <li>
                    Subtotal <span>${subtotal.toFixed(2)}</span>
                </li>
                <li>
                    Total <span>${total.toFixed(2)}</span>
                </li>
            </ul>
            <Link
                to={checkoutHref}
                className="primary-btn"
                onClick={handleCheckout}
            >
                PROCEED TO CHECKOUT
            </Link>
        </div>
    );
};

export default CartSummary;
