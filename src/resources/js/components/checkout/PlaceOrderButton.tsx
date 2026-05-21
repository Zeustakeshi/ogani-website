import React, { useState } from "react";

interface PlaceOrderButtonProps {
    onPlaceOrder?: () => void;
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
    onPlaceOrder,
}) => {
    const [agreeTerms, setAgreeTerms] = useState(false);

    return (
        <>
            <div className="checkout__input checkout__input--checkbox">
                <p>Create an account?</p>
                <span>
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                </span>
            </div>
            <div className="checkout__text">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adip elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>
            <button
                type="button"
                className="site-btn checkout__button__btn"
                onClick={onPlaceOrder}
            >
                PLACE ORDER
            </button>
        </>
    );
};

export default PlaceOrderButton;
