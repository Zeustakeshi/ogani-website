import React from "react";
import Button from "../ui/Button";

interface ProductInfoProps {
    title?: string;
    reviewsCount?: number;
    price?: string;
    description?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
    title = "Vegetable’s Package",
    reviewsCount = 18,
    price = "$50.00",
    description = "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Sed porttitor lectus nibh.",
}) => {
    return (
        <div className="product__details__text">
            <h4>{title}</h4>
            <div className="product__details__rating">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-half"></i>
                <span>({reviewsCount} reviews)</span>
            </div>
            <div className="product__details__price">{price}</div>
            <p>{description}</p>
            <div className="product__details__cart">
                <div className="quantity">
                    <div className="pro-qty">
                        <input type="text" defaultValue="1" />
                    </div>
                </div>
                <Button>ADD TO CARD</Button>
            </div>
        </div>
    );
};

export default ProductInfo;
