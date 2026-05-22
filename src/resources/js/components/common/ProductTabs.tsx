import React, { useState } from "react";
import ProductReviewInput from "@/components/product/ProductReviewInput";
import ProductReviewList, {
    ProductReviewItem,
} from "@/components/product/ProductReviewList";

interface ProductTabsProps {
    description?: string[];
    information?: string[];
    reviewsCount?: number;
    productId?: string;
    reviews?: ProductReviewItem[];
    currentUser?: {
        id: number;
        username?: string | null;
    } | null;
    isReviewsLoading?: boolean;
    onReviewSubmitted?: () => void | Promise<void>;
    hasUserReview?: boolean;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
    description = [
        "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus. Vivamus suscipit tortor eget felis porttitor volutpat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Donec rutrum congue leo eget malesuada. Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Proin eget tortor risus.",
        "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Cras ultricies ligula sed magna dictum porta. Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus.",
    ],
    information = [
        "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus. Vivamus suscipit tortor eget felis porttitor volutpat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Donec rutrum congue leo eget malesuada. Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Proin eget tortor risus.",
        "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Cras ultricies ligula sed magna dictum porta. Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    ],
    reviewsCount = 1,
    productId,
    reviews = [],
    currentUser,
    isReviewsLoading = false,
    onReviewSubmitted,
    hasUserReview = false,
}) => {
    const [activeTab, setActiveTab] = useState<
        "description" | "information" | "reviews"
    >("description");

    return (
        <div className="product__details__tab">
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                        data-toggle="tab"
                        href="#tabs-1"
                        role="tab"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("description");
                        }}
                    >
                        Description
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === "information" ? "active" : ""}`}
                        data-toggle="tab"
                        href="#tabs-2"
                        role="tab"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("information");
                        }}
                    >
                        Information
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                        data-toggle="tab"
                        href="#tabs-3"
                        role="tab"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("reviews");
                        }}
                    >
                        Reviews <span>({reviewsCount})</span>
                    </a>
                </li>
            </ul>
            <div className="tab-content">
                <div
                    className={`tab-pane ${activeTab === "description" ? "active" : ""}`}
                    id="tabs-1"
                    role="tabpanel"
                >
                    <div className="product__details__tab__desc">
                        <h6>Products Infomation</h6>
                        {description.map((paragraph, index) => (
                            <p key={`description-${index}`}>{paragraph}</p>
                        ))}
                    </div>
                </div>
                <div
                    className={`tab-pane ${activeTab === "information" ? "active" : ""}`}
                    id="tabs-2"
                    role="tabpanel"
                >
                    <div className="product__details__tab__desc">
                        <h6>Products Infomation</h6>
                        {information.map((paragraph, index) => (
                            <p key={`information-${index}`}>{paragraph}</p>
                        ))}
                    </div>
                </div>
                <div
                    className={`tab-pane ${activeTab === "reviews" ? "active" : ""}`}
                    id="tabs-3"
                    role="tabpanel"
                >
                    <div className="product__reviews">
                        <ProductReviewInput
                            productId={productId}
                            currentUser={currentUser}
                            hasExistingReview={hasUserReview}
                            onSubmitted={onReviewSubmitted}
                        />
                        <ProductReviewList
                            reviews={reviews}
                            reviewsCount={reviewsCount}
                            isLoading={isReviewsLoading}
                            productId={productId}
                            currentUser={currentUser}
                            onMutated={onReviewSubmitted}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTabs;
