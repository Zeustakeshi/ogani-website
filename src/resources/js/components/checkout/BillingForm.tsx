import React, { useState } from "react";
import ShippingToggle from "./ShippingToggle";

interface BillingFormProps {}

const BillingForm: React.FC<BillingFormProps> = () => {
    const [showAccountForm, setShowAccountForm] = useState(false);

    return (
        <div className="checkout__form">
            <h4>Billing Details</h4>
            <form action="#">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="checkout__input">
                            <p>
                                Fist Name<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="checkout__input">
                            <p>
                                Last Name<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="checkout__input">
                            <p>
                                Country<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="col-lg-12">
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
                                placeholder="Apartment, suite, unite ect (optional)"
                            />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="checkout__input">
                            <p>
                                Town/City<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="checkout__input">
                            <p>
                                Country/State<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="checkout__input">
                            <p>
                                Postcode / ZIP<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="checkout__input">
                            <p>
                                Phone<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="checkout__input">
                            <p>
                                Email Address<span>*</span>
                            </p>
                            <input type="text" />
                        </div>
                    </div>

                    {/* Create Account Toggle */}
                    <div className="col-lg-12">
                        <div className="checkout__input checkout__input--checkbox">
                            <input
                                type="checkbox"
                                id="create-acc"
                                onChange={(e) =>
                                    setShowAccountForm(e.target.checked)
                                }
                            />
                            <label htmlFor="create-acc">
                                Create an account?
                            </label>
                        </div>
                    </div>
                    {showAccountForm && (
                        <div className="col-lg-12">
                            <div className="checkout__input checkout__input--checkbox">
                                <p>
                                    Create an account by entering the
                                    information below. If you are a returning
                                    customer please login at the top of the page
                                </p>
                            </div>
                            <div className="checkout__input">
                                <p>
                                    Account Password<span>*</span>
                                </p>
                                <input type="text" />
                            </div>
                        </div>
                    )}

                    {/* Shipping Toggle */}
                    <div className="col-lg-12">
                        <ShippingToggle />
                    </div>

                    {/* Order Notes */}
                    <div className="col-lg-12">
                        <div className="checkout__input checkout__input__textarea">
                            <p>Order notes</p>
                            <textarea placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BillingForm;
