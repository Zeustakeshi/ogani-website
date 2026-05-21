import React from "react";
import ProductCard from "../ui/ProductCard";

interface RelatedProduct {
    id: number;
    image: string;
    title: string;
    price: string;
}

interface RelatedProductsProps {
    products?: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
    products = [
        {
            id: 1,
            image: "/img/product/product-1.jpg",
            title: "Crab Pool Security",
            price: "$30.00",
        },
        {
            id: 2,
            image: "/img/product/product-2.jpg",
            title: "Crab Pool Security",
            price: "$30.00",
        },
        {
            id: 3,
            image: "/img/product/product-3.jpg",
            title: "Crab Pool Security",
            price: "$30.00",
        },
        {
            id: 4,
            image: "/img/product/product-7.jpg",
            title: "Crab Pool Security",
            price: "$30.00",
        },
    ],
}) => {
    return (
        <section className="related-product">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title related__product__title">
                            <h2>Related Product</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="col-lg-3 col-md-4 col-sm-6"
                        >
                            <ProductCard
                                image={product.image}
                                title={product.title}
                                price={product.price}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;
