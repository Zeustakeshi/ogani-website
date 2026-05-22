import React from "react";
import ProductCard from "../ui/ProductCard";

interface ProductGridProps {
    products?: Array<{
        id: number | string;
        image: string;
        title: string;
        price: string;
        oldPrice?: string;
        onSale?: boolean;
        link?: string;
    }>;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products = [] }) => {
    return (
        <div className="row">
            {products.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6 col-sm-6">
                    <ProductCard
                        image={product.image}
                        title={product.title}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        onSale={product.onSale}
                        link={product.link}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
