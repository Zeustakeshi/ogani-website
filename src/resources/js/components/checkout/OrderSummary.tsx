import React from "react";
import PaymentMethods from "./PaymentMethods";
import PlaceOrderButton from "./PlaceOrderButton";

interface OrderSummaryProps {}

const OrderSummary: React.FC<OrderSummaryProps> = () => {
    const items = [
        { name: "Vegetable’s Package", price: 75.99 },
        { name: "Fresh Vegetable", price: 151.99 },
        { name: "Organic Bananas", price: 53.99 },
    ];

    const subtotal = 750.99;
    const total = 750.99;

    return (
        <div className="checkout__order">
            <h4>Your Order</h4>
            <div className="checkout__order__products">
                Products <span>Total</span>
            </div>
            <ul>
                {items.map((item) => (
                    <li key={item.name}>
                        {item.name} <span>${item.price.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="checkout__order__subtotal">
                Subtotal <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout__order__total">
                Total <span>${total.toFixed(2)}</span>
            </div>
            <div className="checkout__input__checkbox">
                <label htmlFor="acc-or">
                    Create an account?
                    <input type="checkbox" id="acc-or" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <p>
                Lorem ipsum dolor sit amet, consectetur adip elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <PaymentMethods />
            <PlaceOrderButton />
        </div>
    );
};

export default OrderSummary;
