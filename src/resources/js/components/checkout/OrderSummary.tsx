import React from "react";
import PaymentMethods from "./PaymentMethods";
import PlaceOrderButton from "./PlaceOrderButton";

type OrderSummaryItem = {
    name: string;
    price: number;
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
                        <li key={item.name}>
                            {item.name}{" "}
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
            <PaymentMethods />
            <PlaceOrderButton
                onPlaceOrder={onPlaceOrder}
                isLoading={isPlacingOrder}
            />
        </div>
    );
};

export default OrderSummary;
