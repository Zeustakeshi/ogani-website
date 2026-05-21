import React from "react";
import ShippingToggle from "./ShippingToggle";

interface BillingFormProps {}

const BillingForm: React.FC<BillingFormProps> = () => {
    return (
        <>
            <div className="row">
                <div className="col-lg-6">
                    <div className="checkout__input">
                        <p>
                            Fist Name<span>*</span>
                        </p>
                        <input type="text" />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="checkout__input">
                        <p>
                            Last Name<span>*</span>
                        </p>
                        <input type="text" />
                    </div>
                </div>
            </div>
            <div className="checkout__input">
                <p>
                    Country<span>*</span>
                </p>
                <input type="text" />
            </div>
            <div className="checkout__input">
                <p>
                    Address<span>*</span>
                </p>
                <input
                    type="text"
                    placeholder="Street Address"
                    className="checkout__input__add"
                />
                <input
                    type="text"
                    placeholder="Apartment, suite, unite ect (optinal)"
                />
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
            <div className="row">
                <div className="col-lg-6">
                    <div className="checkout__input">
                        <p>
                            Phone<span>*</span>
                        </p>
                        <input type="text" />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="checkout__input">
                        <p>
                            Email<span>*</span>
                        </p>
                        <input type="text" />
                    </div>
                </div>
            </div>
            <div className="checkout__input__checkbox">
                <label htmlFor="acc">
                    Create an account?
                    <input type="checkbox" id="acc" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <p>
                Create an account by entering the information below. If you are
                a returning customer please login at the top of the page
            </p>
            <div className="checkout__input">
                <p>
                    Account Password<span>*</span>
                </p>
                <input type="text" />
            </div>
            <ShippingToggle />
            <div className="checkout__input">
                <p>
                    Order notes<span>*</span>
                </p>
                <input
                    type="text"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                />
            </div>
        </>
    );
};

export default BillingForm;
