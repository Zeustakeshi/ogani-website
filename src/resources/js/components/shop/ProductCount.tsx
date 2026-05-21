import React from "react";

interface ProductCountProps {
    count?: number;
    text?: string;
}

const ProductCount: React.FC<ProductCountProps> = ({
    count = 16,
    text = "Products found",
}) => {
    return (
        <div className="filter__found">
            <h6>
                <span>{count}</span> {text}
            </h6>
        </div>
    );
};

export default ProductCount;
