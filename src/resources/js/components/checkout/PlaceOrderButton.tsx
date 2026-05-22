import React from "react";

interface PlaceOrderButtonProps {
    onPlaceOrder?: () => void;
    isLoading?: boolean;
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
    onPlaceOrder,
    isLoading = false,
}) => {
    return (
        <button
            type="button"
            className="site-btn"
            onClick={onPlaceOrder}
            disabled={isLoading}
        >
            {isLoading ? "ĐANG XỬ LÝ..." : "PLACE ORDER"}
        </button>
    );
};

export default PlaceOrderButton;
