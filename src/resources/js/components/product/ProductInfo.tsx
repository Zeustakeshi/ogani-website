import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { ProductReviewItem } from "./ProductReviewList";

interface ProductInfoProps {
    title?: string;
    reviewsCount?: number;
    price?: string;
    description?: string;
    quantity?: number;
    image?: string;
    productId?: string;
    availability?: boolean;
    weight?: number;
    onQuantityChange?: (quantity: number) => void;
    reviews?: ProductReviewItem[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({
    title = "Vetgetable’s Package",
    reviewsCount = 18,
    price = "$50.00",
    description = "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus.",
    quantity = 1,
    image = "/img/product/details/product-details-1.jpg",
    productId = "1",
    availability = true,
    weight = 0.5,
    onQuantityChange,
    reviews,
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

    const addToCart = async (e?: React.MouseEvent<HTMLAnchorElement>) => {
        e?.preventDefault();

        try {
            if (!productId) {
                return;
            }

            await api.post("/cart/items", {
                product_id: productId,
                amount: currentQuantity,
            });

            window.dispatchEvent(new Event("cart:updated"));

            // eslint-disable-next-line no-alert
            alert(`${title} (x${currentQuantity}) added to cart`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to add to cart", err);
        }
    };

    const starValues = [1, 2, 3, 4, 5];
    const renderStars = (rating: number) =>
        starValues.map((starNumber) => (
            <i
                key={`review-star-${starNumber}`}
                className={starNumber <= rating ? "fa fa-star" : "fa fa-star-o"}
                aria-hidden="true"
            />
        ));

    const averageRating =
        reviews.length > 0
            ? reviews.reduce(
                  (sum, review) => sum + Number(review.rating || 0),
                  0,
              ) / reviews.length
            : 0;

    return (
        <div className="product__details__text">
            <h3>{title}</h3>
            <div
                className="product__reviews__summary"
                aria-label="Rating summary"
            >
                <div>{renderStars(Math.round(averageRating))}</div>
                <span>
                    {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}/5
                </span>
                <span>({reviewsCount} người đánh giá)</span>
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
                    <b>Availability</b>{" "}
                    <span>{availability ? "In Stock" : "Out of Stock"}</span>
                </li>
                <li>
                    <b>Shipping</b>{" "}
                    <span>
                        01 day shipping. <samp>Free pickup today</samp>
                    </span>
                </li>
                <li>
                    <b>Weight</b> <span>{weight} kg</span>
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
