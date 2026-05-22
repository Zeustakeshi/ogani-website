import React from "react";

interface CartItem {
    id: string;
    image: string;
    title: string;
    price: number;
    quantity: number;
    total: number;
}

interface CartTableProps {
    items?: CartItem[];
    onQuantityChange?: (id: string, quantity: number) => void;
    onRemove?: (id: string) => void;
}

const CartTable: React.FC<CartTableProps> = ({
    items = [],
    onQuantityChange,
    onRemove,
}) => {
    const priceFormatter = new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 0,
    });

    return (
        <div className="shoping__cart__table">
            <table>
                <thead>
                    <tr>
                        <th className="shoping__product">Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                Giỏ hàng của bạn đang trống.
                            </td>
                        </tr>
                    )}
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="shoping__cart__item">
                                <img
                                    src={item.image}
                                    style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                    alt={item.title}
                                />
                                <h5>{item.title}</h5>
                            </td>
                            <td className="shoping__cart__price">
                                {`${priceFormatter.format(item.price)}đ`}
                            </td>
                            <td className="shoping__cart__quantity">
                                <div className="quantity">
                                    <div className="pro-qty">
                                        <input
                                            type="text"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const quantity = Number(
                                                    e.target.value,
                                                );

                                                if (!Number.isNaN(quantity)) {
                                                    onQuantityChange?.(
                                                        item.id,
                                                        quantity,
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="shoping__cart__total">
                                {`${priceFormatter.format(item.total)}đ`}
                            </td>
                            <td className="shoping__cart__item__close">
                                <span
                                    className="icon_close"
                                    onClick={() => onRemove?.(item.id)}
                                ></span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CartTable;
