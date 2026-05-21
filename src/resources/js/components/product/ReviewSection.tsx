import React from "react";

interface ReviewSectionProps {
    title?: string;
    content?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
    title = "Products Infomation",
    content = "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus.",
}) => {
    return (
        <div className="product__details__tab__desc">
            <h6>{title}</h6>
            <p>{content}</p>
        </div>
    );
};

export default ReviewSection;
