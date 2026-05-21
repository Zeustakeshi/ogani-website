import React, { useState } from "react";

interface ShippingToggleProps {}

const ShippingToggle: React.FC<ShippingToggleProps> = () => {
    const [showShipping, setShowShipping] = useState(false);

    return (
        <div className="checkout__input checkout__input--checkbox p-relative">
            <input
                type="checkbox"
                id="diff-acc"
                onChange={(e) => setShowShipping(e.target.checked)}
            />
            <label htmlFor="diff-acc">Ship to a different address?</label>

            {showShipping && (
                <div className="checkout__content">
                    {/* Placeholder for shipping address fields if expanded */}
                    <div className="checkout__input">
                        <p>
                            Street Address<span>*</span>
                        </p>
                        <input type="text" className="checkout__input__add" />
                        <input type="text" />
                    </div>
                    <div className="checkout__input">
                        <p>
                            Town/City<span>*</span>
                        </p>
                        <input type="text" />
                    </div>
                    <div className="checkout__input">
                        <p>
                            Country/State<span>*</span>
                        </p>
                        <input type="text" />
                    </div>
                    <div className="checkout__input">
                        <p>
                            Postcode / ZIP<span>*</span>
                        </p>
                        <input type="text" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShippingToggle;
