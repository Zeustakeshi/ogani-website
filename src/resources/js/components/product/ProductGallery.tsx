import React, { useEffect, useState } from "react";

interface ProductGalleryProps {
    mainImage?: string;
    thumbnails?: Array<{
        bigImage: string;
        thumbnailImage: string;
    }>;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
    mainImage = "/img/product/details/product-details-1.jpg",
    thumbnails = [
        {
            bigImage: "/img/product/details/product-details-2.jpg",
            thumbnailImage: "/img/product/details/thumb-1.jpg",
        },
        {
            bigImage: "/img/product/details/product-details-3.jpg",
            thumbnailImage: "/img/product/details/thumb-2.jpg",
        },
        {
            bigImage: "/img/product/details/product-details-5.jpg",
            thumbnailImage: "/img/product/details/thumb-3.jpg",
        },
        {
            bigImage: "/img/product/details/product-details-4.jpg",
            thumbnailImage: "/img/product/details/thumb-4.jpg",
        },
    ],
}) => {
    const [selectedImage, setSelectedImage] = useState(mainImage);

    useEffect(() => {
        setSelectedImage(mainImage);
    }, [mainImage]);

    return (
        <div className="product__details__pic">
            <div className="product__details__pic__item">
                <img
                    className="product__details__pic__item--large"
                    src={selectedImage}
                    alt="Vegetable Package"
                />
            </div>
            <div
                className="product__details__pic__slider owl-carousel"
                style={{ display: "flex", gap: "10px", overflowX: "auto" }}
            >
                {thumbnails.map((thumbnail, index) => (
                    <img
                        key={`${thumbnail.thumbnailImage}-${index}`}
                        src={thumbnail.thumbnailImage}
                        data-imgbigurl={thumbnail.bigImage}
                        alt={`Product thumbnail ${index + 1}`}
                        onClick={() => setSelectedImage(thumbnail.bigImage)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;
