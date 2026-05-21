import React from "react";
import { Link } from "react-router-dom";

interface CartActionsProps {
    continueHref?: string;
    onContinueShopping?: () => void;
    onUpdateCart?: () => void;
}

const CartActions: React.FC<CartActionsProps> = ({
    continueHref = "/shop",
    onContinueShopping,
    onUpdateCart,
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
                CONTINUE SHOPPING
            </Link>
            <a
                href="#"
                className="primary-btn cart-btn cart-btn-right"
                onClick={handleUpdateCart}
            >
                <span className="icon_loading"></span> Upadate Cart
            </a>
        </div>
    );
};

export default CartActions;
