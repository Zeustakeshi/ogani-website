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

    const subtotal = items.reduce((acc, item) => acc + item.price, 0);
    const total = subtotal; // Logic for shipping/tax can be added here

    return (
        <div className="order-summary">
            <h4>Your Order</h4>
            <div className="order__table">
                <table>
                    <thead>
                        <tr>
                            <th>Products</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item.name} <span>X 1</span>
                                </td>
                                <td>${item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Subtotal</th>
                            <td>${subtotal}</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td className="fw-bold">${total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <PaymentMethods />
            <PlaceOrderButton />
        </div>
    );
};

export default OrderSummary;
