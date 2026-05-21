import React, { useState } from "react";

interface ProductTabsProps {
    description?: string;
    information?: string;
    reviews?: Array<{
        author: string;
        rating: number;
        comment: string;
        date: string;
    }>;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
    description = "",
    information = "",
    reviews = [],
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
                        Reviews <span>(1)</span>
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
                        <p dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                </div>
                <div
                    className={`tab-pane ${activeTab === "information" ? "active" : ""}`}
                    id="tabs-2"
                    role="tabpanel"
                >
                    <div className="product__details__tab__desc">
                        <h6>Products Infomation</h6>
                        <p dangerouslySetInnerHTML={{ __html: information }} />
                    </div>
                </div>
                <div
                    className={`tab-pane ${activeTab === "reviews" ? "active" : ""}`}
                    id="tabs-3"
                    role="tabpanel"
                >
                    <div className="product__details__tab__desc">
                        <h6>Products Infomation</h6>
                        <p dangerouslySetInnerHTML={{ __html: information }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTabs;
