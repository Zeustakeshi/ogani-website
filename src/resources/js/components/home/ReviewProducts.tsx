import React from "react";

interface ProductItem {
    id: number;
    image: string;
    title: string;
    price: string;
}

interface ReviewProductsProps {
    title?: string;
    items?: ProductItem[];
}

const getSliderGroups = (items: ProductItem[]) => [items, items];

const ReviewProducts: React.FC<ReviewProductsProps> = ({
    title = "Review Products",
    items = [
        {
            id: 1,
            image: "img/latest-product/lp-1.jpg",
            title: "Crab Pool Security",
            price: "$30.00",
        },
        {
            id: 2,
            image: "img/latest-product/lp-2.jpg",
            title: "Crab Pool Security",
            price: "$30.00",
        },
        {
            id: 3,
            image: "img/latest-product/lp-3.jpg",
            title: "Crab Pool Security",
            price: "$30.00",
        },
    ],
}) => {
    return (
        <div className="col-lg-4 col-md-6">
            <div className="latest-product__text">
                <h4>{title}</h4>
                <div className="latest-product__slider owl-carousel">
                    {getSliderGroups(items).map((group, groupIndex) => (
                        <div
                            key={`${title}-${groupIndex}`}
                            className="latest-prdouct__slider__item"
                        >
                            {group.map((item) => (
                                <a
                                    key={item.id}
                                    href="#"
                                    className="latest-product__item"
                                >
                                    <div className="latest-product__item__pic">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                        />
                                    </div>
                                    <div className="latest-product__item__text">
                                        <h6>{item.title}</h6>
                                        <span>{item.price}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewProducts;
