import React from "react";

interface PlaceOrderButtonProps {
    onPlaceOrder?: () => void;
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
    onPlaceOrder,
}) => {
    return (
        <button type="submit" className="site-btn" onClick={onPlaceOrder}>
            PLACE ORDER
        </button>
    );
};

export default PlaceOrderButton;
