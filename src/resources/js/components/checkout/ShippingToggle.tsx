import React from "react";

interface ShippingToggleProps {}

const ShippingToggle: React.FC<ShippingToggleProps> = () => {
    return (
        <div className="checkout__input__checkbox">
            <label htmlFor="diff-acc">
                Ship to a different address?
                <input type="checkbox" id="diff-acc" />
                <span className="checkmark"></span>
            </label>
        </div>
    );
};

export default ShippingToggle;
