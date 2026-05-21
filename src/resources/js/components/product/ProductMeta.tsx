import React from "react";

interface ProductMetaProps {
    availability?: string;
    shipping?: string;
    weight?: string;
}

const ProductMeta: React.FC<ProductMetaProps> = ({
    availability = "In Stock",
    shipping = "01 day shipping. Free pickup today",
    weight = "0.5 kg",
}) => {
    return (
        <ul className="product__details__widget">
            <li>
                <span>Availability:</span>
                <div className="stock">
                    <span>{availability}</span>
                </div>
            </li>
            <li>
                <span>Shipping:</span>
                <span>{shipping}</span>
            </li>
            <li>
                <span>Weight:</span>
                <span>{weight}</span>
            </li>
            <li>
                <span>Share on:</span>
                <div className="social-share">
                    <a href="#">
                        <i className="fa fa-facebook"></i>
                    </a>
                    <a href="#">
                        <i className="fa fa-twitter"></i>
                    </a>
                    <a href="#">
                        <i className="fa fa-linkedin"></i>
                    </a>
                    <a href="#">
                        <i className="fa fa-pinterest-p"></i>
                    </a>
                </div>
            </li>
        </ul>
    );
};

export default ProductMeta;
