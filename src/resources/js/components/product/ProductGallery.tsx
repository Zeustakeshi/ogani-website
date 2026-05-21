import React from "react";

interface ProductGalleryProps {
    mainImage?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
    mainImage = "img/product/details/product-details.jpg",
}) => {
    return (
        <div className="product__details__pic">
            <img src={mainImage} alt="Product Detail" />
        </div>
    );
};

export default ProductGallery;
