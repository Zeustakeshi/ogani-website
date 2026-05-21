import React from "react";

interface PaymentMethodsProps {}

const PaymentMethods: React.FC<PaymentMethodsProps> = () => {
    return (
        <>
            <div className="checkout__input__checkbox">
                <label htmlFor="payment">
                    Check Payment
                    <input type="checkbox" id="payment" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div className="checkout__input__checkbox">
                <label htmlFor="paypal">
                    Paypal
                    <input type="checkbox" id="paypal" />
                    <span className="checkmark"></span>
                </label>
            </div>
        </>
    );
};

export default PaymentMethods;
