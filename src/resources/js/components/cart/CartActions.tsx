import React from "react";
import Button from "../ui/Button";

interface CartActionsProps {
    onContinueShopping?: () => void;
    onUpdateCart?: () => void;
}

const CartActions: React.FC<CartActionsProps> = ({
    onContinueShopping,
    onUpdateCart,
}) => {
    return (
        <div className="cart__actions">
            <Button variant="primary" onClick={onContinueShopping}>
                CONTINUE SHOPPING
            </Button>
            <Button onClick={onUpdateCart}>Upadate Cart</Button>
        </div>
    );
};

export default CartActions;
