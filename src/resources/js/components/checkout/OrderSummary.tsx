import React from "react";
import PaymentMethods from "./PaymentMethods";
import PlaceOrderButton from "./PlaceOrderButton";

type OrderSummaryItem = {
    image: string;
    name: string;
    price: number;
    quantity: number;
};

interface OrderSummaryProps {
    items?: OrderSummaryItem[];
    subtotal?: number;
    total?: number;
    onPlaceOrder?: () => void;
    isPlacingOrder?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    items = [],
    subtotal = 0,
    total = 0,
    onPlaceOrder,
    isPlacingOrder = false,
}) => {
    const priceFormatter = new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 0,
    });

    return (
        <div className="checkout__order">
            <h4>Your Order</h4>
            <div className="checkout__order__products">
                Products <span>Total</span>
            </div>
            <ul>
                {items.length > 0 ? (
                    items.map((item) => (
                        <li
                            key={`${item.name}-${item.quantity}`}
                            style={{
                                display: "flex",
                                gap: 12,
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                    width: 54,
                                    height: 54,
                                    objectFit: "cover",
                                }}
                            />
                            <span style={{ flex: 1 }}>
                                {item.name} x{item.quantity}
                            </span>
                            <span>{`${priceFormatter.format(item.price)}đ`}</span>
                        </li>
                    ))
                ) : (
                    <li>
                        Giỏ hàng của bạn đang trống <span>0đ</span>
                    </li>
                )}
            </ul>
            <div className="checkout__order__subtotal">
                Subtotal <span>{`${priceFormatter.format(subtotal)}đ`}</span>
            </div>
            <div className="checkout__order__total">
                Total <span>{`${priceFormatter.format(total)}đ`}</span>
            </div>

            <PlaceOrderButton
                onPlaceOrder={onPlaceOrder}
                isLoading={isPlacingOrder}
            />
        </div>
    );
};

export default OrderSummary;
