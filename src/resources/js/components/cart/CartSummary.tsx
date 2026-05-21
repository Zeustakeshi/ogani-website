import React from "react";
import Button from "../ui/Button";

interface CartSummaryProps {
    subtotal?: number;
    shipping?: number;
    total?: number;
    onCheckout?: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
    subtotal = 454.98,
    shipping = 0,
    total = 454.98,
    onCheckout,
}) => {
    return (
        <div className="cart__total">
            <h6>Cart Total</h6>
            <ul>
                <li>
                    Subtotal <span>${subtotal.toFixed(2)}</span>
                </li>
                <li>
                    Shipping <span>${shipping.toFixed(2)}</span>
                </li>
                <li>
                    Total <span>${total.toFixed(2)}</span>
                </li>
            </ul>
            <Button onClick={onCheckout}>PROCEED TO CHECKOUT</Button>
        </div>
    );
};

export default CartSummary;
