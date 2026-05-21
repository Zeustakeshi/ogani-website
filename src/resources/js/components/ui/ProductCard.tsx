import React from "react";

interface ProductCardProps {
    image: string;
    title: string;
    price: string;
    oldPrice?: string;
    onSale?: boolean;
    link?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    image,
    title,
    price,
    oldPrice,
    onSale = false,
    link = "#",
}) => {
    return (
        <div className={`product__item ${onSale ? "sale__item" : ""}`}>
            <div className="product__item__pic set-bg" data-setbg={image}>
                {onSale && (
                    <div className="sale__icon">
                        <img src="/img/sale-icon.png" alt="Sale" />
                    </div>
                )}
                <ul className="product__item__pic__hover">
                    <li>
                        <a href="#">
                            <i className="fa fa-heart"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fa fa-retweet"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fa fa-shopping-cart"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="product__item__text">
                <h6>
                    <a href={link}>{title}</a>
                </h6>
                <h5>
                    {price}
                    {oldPrice && <span> {oldPrice}</span>}
                </h5>
            </div>
        </div>
    );
};

export default ProductCard;
