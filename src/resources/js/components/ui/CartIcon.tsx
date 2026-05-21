import React from "react";

interface CartIconProps {
    count?: number | string;
    totalText?: string;
}

const CartIcon: React.FC<CartIconProps> = ({
    count = 1,
    totalText = "3 item: $150.00",
}) => {
    return (
        <div className="header__cart">
            <a href="#">
                <span className="icon_bag_alt"></span>
                <sup>{count}</sup>
            </a>
            <span>{totalText}</span>
        </div>
    );
};

export default CartIcon;
