import React from "react";

const FeaturedProducts: React.FC = () => {
    const tabs = [
        { label: "All", filter: "*", active: true },
        { label: "Oranges", filter: ".oranges" },
        { label: "Fresh Meat", filter: ".fresh-meat" },
        { label: "Vegetables", filter: ".vegetables" },
        { label: "Fastfood", filter: ".fastfood" },
    ];

    const products = [
        {
            id: 1,
            image: "img/featured/feature-1.jpg",
            classes: "oranges fresh-meat",
        },
        {
            id: 2,
            image: "img/featured/feature-2.jpg",
            classes: "vegetables fastfood",
        },
        {
            id: 3,
            image: "img/featured/feature-3.jpg",
            classes: "vegetables fresh-meat",
        },
        {
            id: 4,
            image: "img/featured/feature-4.jpg",
            classes: "fastfood oranges",
        },
        {
            id: 5,
            image: "img/featured/feature-5.jpg",
            classes: "fresh-meat vegetables",
        },
        {
            id: 6,
            image: "img/featured/feature-6.jpg",
            classes: "oranges fastfood",
        },
        {
            id: 7,
            image: "img/featured/feature-7.jpg",
            classes: "fresh-meat vegetables",
        },
        {
            id: 8,
            image: "img/featured/feature-8.jpg",
            classes: "fastfood vegetables",
        },
    ];

    return (
        <section className="featured spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>Featured Product</h2>
                        </div>
                        <div className="featured__controls">
                            <ul>
                                {tabs.map((tab) => (
                                    <li
                                        key={tab.label}
                                        className={tab.active ? "active" : ""}
                                        data-filter={tab.filter}
                                    >
                                        {tab.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row featured__filter">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className={`col-lg-3 col-md-4 col-sm-6 mix ${product.classes}`}
                        >
                            <div className="featured__item">
                                <div
                                    className="featured__item__pic set-bg"
                                    data-setbg={product.image}
                                >
                                    <ul className="featured__item__pic__hover">
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-heart"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-retweet"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-shopping-cart"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="featured__item__text">
                                    <h6>
                                        <a href="#">Crab Pool Security</a>
                                    </h6>
                                    <h5>$30.00</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
