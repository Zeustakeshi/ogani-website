import React from "react";
import { Link } from "react-router-dom";

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
            <div className={`product__item__pic set-bg`}>
                <img
                    src={image}
                    alt={title}
                    className="product__item__img"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
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
                    <Link to={link}>{title}</Link>
                </h6>
                <h5>
                    {price}
                    {oldPrice && <span> {oldPrice}</span>}
                </h5>
                <Link to={link} className="primary-btn product__item__view">
                    Xem sản phẩm
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
