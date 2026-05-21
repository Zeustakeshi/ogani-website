import React from "react";

interface ProductMetaProps {
    availability?: string;
    shipping?: string;
    freePickup?: string;
    weight?: string;
}

const ProductMeta: React.FC<ProductMetaProps> = ({
    availability = "In Stock",
    shipping = "01 day shipping.",
    freePickup = "Free pickup today",
    weight = "0.5 kg",
}) => {
    return (
        <>
            <a href="#" className="heart-icon">
                <span className="icon_heart_alt"></span>
            </a>
            <ul>
                <li>
                    <b>Availability</b> <span>{availability}</span>
                </li>
                <li>
                    <b>Shipping</b>{" "}
                    <span>
                        {shipping} <samp>{freePickup}</samp>
                    </span>
                </li>
                <li>
                    <b>Weight</b> <span>{weight}</span>
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
        </>
    );
};

export default ProductMeta;
