import React, { useState } from "react";

interface PaymentMethodsProps {}

const PaymentMethods: React.FC<PaymentMethodsProps> = () => {
    const [method, setMethod] = useState("check");

    return (
        <div className="payment__checkout">
            <div className="checkout__input">
                <p>Check Payment</p>
                <span>
                    <input
                        type="radio"
                        name="payment-method"
                        id="check"
                        checked={method === "check"}
                        onChange={() => setMethod("check")}
                    />
                </span>
            </div>
            <div className="checkout__content">
                <p>
                    Make your payment directly into our bank account. Please use
                    your Order ID as the payment reference. Your order will not
                    be shipped until the funds have cleared in our account.
                </p>
            </div>
            <div className="checkout__input">
                <p>Paypal</p>
                <span>
                    <input
                        type="radio"
                        name="payment-method"
                        id="paypal"
                        checked={method === "paypal"}
                        onChange={() => setMethod("paypal")}
                    />
                </span>
            </div>
        </div>
    );
};

export default PaymentMethods;
