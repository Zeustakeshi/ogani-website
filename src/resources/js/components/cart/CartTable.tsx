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
            image: "img/cart/cart-1.jpg",
            title: "Vegetable's Package",
            price: 55.0,
            quantity: 1,
            total: 110.0,
        },
        {
            id: 2,
            image: "img/cart/cart-2.jpg",
            title: "Fresh Garden Vegetable",
            price: 39.0,
            quantity: 1,
            total: 39.99,
        },
        {
            id: 3,
            image: "img/cart/cart-3.jpg",
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
        <div className="cart__table">
            <table>
                <thead>
                    <tr>
                        <th>Products</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="cart__product__item">
                                <img src={item.image} alt={item.title} />
                                <div className="cart__product__item__title">
                                    <h6>{item.title}</h6>
                                </div>
                            </td>
                            <td className="cart__price">
                                ${item.price.toFixed(2)}
                            </td>
                            <td className="cart__quantity">
                                <div className="quantity">
                                    <div className="pro-qty">
                                        <input
                                            type="text"
                                            defaultValue={item.quantity}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="cart__total">
                                ${item.total.toFixed(2)}
                            </td>
                            <td className="cart__close">
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
