import React from "react";

interface CartItem {
    id: number;
    image: string;
    title: string;
    price: number;
    quantity: number;
    total: number;
}

interface CartTableProps {
    items?: CartItem[];
    onQuantityChange?: (id: number, quantity: number) => void;
    onRemove?: (id: number) => void;
}

const CartTable: React.FC<CartTableProps> = ({
    items = [
        {
            id: 1,
            image: "/img/cart/cart-1.jpg",
            title: "Vegetable’s Package",
            price: 55.0,
            quantity: 1,
            total: 110.0,
        },
        {
            id: 2,
            image: "/img/cart/cart-2.jpg",
            title: "Fresh Garden Vegetable",
            price: 39.0,
            quantity: 1,
            total: 39.99,
        },
        {
            id: 3,
            image: "/img/cart/cart-3.jpg",
            title: "Organic Bananas",
            price: 69.0,
            quantity: 1,
            total: 69.99,
        },
    ],
    onQuantityChange,
    onRemove,
}) => {
    return (
        <div className="shoping__cart__table">
            <table>
                <thead>
                    <tr>
                        <th className="shoping__product">Products</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="shoping__cart__item">
                                <img src={item.image} alt={item.title} />
                                <h5>{item.title}</h5>
                            </td>
                            <td className="shoping__cart__price">
                                ${item.price.toFixed(2)}
                            </td>
                            <td className="shoping__cart__quantity">
                                <div className="quantity">
                                    <div className="pro-qty">
                                        <input
                                            type="text"
                                            defaultValue={item.quantity}
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
                                ${item.total.toFixed(2)}
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
