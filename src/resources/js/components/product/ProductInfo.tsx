import React, { useEffect, useState } from "react";

interface ProductInfoProps {
    title?: string;
    reviewsCount?: number;
    price?: string;
    description?: string;
    quantity?: number;
    onQuantityChange?: (quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
    title = "Vetgetable’s Package",
    reviewsCount = 18,
    price = "$50.00",
    description = "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus.",
    quantity = 1,
    onQuantityChange,
}) => {
    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    useEffect(() => {
        setCurrentQuantity(quantity);
    }, [quantity]);

    const updateQuantity = (nextQuantity: number) => {
        const safeQuantity = Math.max(1, nextQuantity);
        setCurrentQuantity(safeQuantity);
        onQuantityChange?.(safeQuantity);
    };

    const addToCart = (e?: React.MouseEvent) => {
        e?.preventDefault();

        const item = {
            id: 1,
            title,
            price,
            quantity: currentQuantity,
            image: "/img/product/details/product-details-1.jpg",
        };

        try {
            const raw = localStorage.getItem("cart");
            const cart = raw ? JSON.parse(raw) : [];

            // If product exists, increment quantity
            const existing = cart.find((c: any) => c.id === item.id);
            if (existing) {
                existing.quantity = (existing.quantity || 0) + item.quantity;
            } else {
                cart.push(item);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            // Emit custom event so other parts can react
            window.dispatchEvent(
                new CustomEvent("cart:updated", { detail: { cart } }),
            );

            // quick feedback
            // eslint-disable-next-line no-alert
            alert(`${item.title} (x${item.quantity}) added to cart`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to add to cart", err);
        }
    };

    return (
        <div className="product__details__text">
            <h3>{title}</h3>
            <div className="product__details__rating">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-half-o"></i>
                <span>({reviewsCount} reviews)</span>
            </div>
            <div className="product__details__price">{price}</div>
            <p>{description}</p>
            <div className="product__details__quantity">
                <div className="quantity">
                    <div className="pro-qty">
                        <button
                            type="button"
                            style={{
                                background: "none",
                                border: "none",
                            }}
                            onClick={() => updateQuantity(currentQuantity - 1)}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={currentQuantity}
                            onChange={(event) => {
                                const nextValue = Number(event.target.value);

                                if (Number.isNaN(nextValue)) {
                                    return;
                                }

                                updateQuantity(nextValue);
                            }}
                            onBlur={() => updateQuantity(currentQuantity)}
                            onKeyDown={(event) => {
                                if (event.key === "ArrowUp") {
                                    event.preventDefault();
                                    updateQuantity(currentQuantity + 1);
                                }

                                if (event.key === "ArrowDown") {
                                    event.preventDefault();
                                    updateQuantity(currentQuantity - 1);
                                }
                            }}
                        />
                        <button
                            style={{
                                background: "none",
                                border: "none",
                            }}
                            type="button"
                            onClick={() => updateQuantity(currentQuantity + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
            <a href="#" className="primary-btn" onClick={addToCart}>
                ADD TO CARD
            </a>

            <ul>
                <li>
                    <b>Availability</b> <span>In Stock</span>
                </li>
                <li>
                    <b>Shipping</b>{" "}
                    <span>
                        01 day shipping. <samp>Free pickup today</samp>
                    </span>
                </li>
                <li>
                    <b>Weight</b> <span>0.5 kg</span>
                </li>
                <li>
                    <b>Share on</b>
                    <div className="share">
                        <a href="#">
                            <i className="fa fa-facebook"></i>
                        </a>
                        <a href="#">
                            <i className="fa fa-twitter"></i>
                        </a>
                        <a href="#">
                            <i className="fa fa-instagram"></i>
                        </a>
                        <a href="#">
                            <i className="fa fa-pinterest"></i>
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default ProductInfo;
