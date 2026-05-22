import React from "react";
import { Link } from "react-router-dom";

interface CartActionsProps {
    continueHref?: string;
    onContinueShopping?: () => void;
    onUpdateCart?: () => void;
    continueText?: string;
    updateText?: string;
    isDirty?: boolean;
    dirtyCount?: number;
}

const CartActions: React.FC<CartActionsProps> = ({
    continueHref = "/shop",
    onContinueShopping,
    onUpdateCart,
    continueText = "CONTINUE SHOPPING",
    updateText = "Upadate Cart",
    isDirty = false,
    dirtyCount = 0,
}) => {
    const handleContinueShopping = (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        onContinueShopping?.();

        if (onContinueShopping) {
            event.preventDefault();
        }
    };

    const handleUpdateCart = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onUpdateCart?.();

        if (onUpdateCart) {
            event.preventDefault();
        }
    };

    return (
        <div className="shoping__cart__btns">
            <Link
                to={continueHref}
                className="primary-btn cart-btn"
                onClick={handleContinueShopping}
            >
                {continueText}
            </Link>
            <a
                href="#"
                className={`primary-btn cart-btn cart-btn-right${
                    isDirty ? " active" : ""
                }`}
                aria-disabled={!isDirty}
                style={{
                    opacity: isDirty ? 1 : 0.65,
                    transform: isDirty ? "translateY(-1px)" : "none",
                    boxShadow: isDirty
                        ? "0 10px 24px rgba(0, 0, 0, 0.12)"
                        : "none",
                }}
                onClick={handleUpdateCart}
            >
                <span className="icon_loading"></span> {updateText}
                {isDirty && dirtyCount > 0 ? ` (${dirtyCount})` : ""}
            </a>
        </div>
    );
};

export default CartActions;
