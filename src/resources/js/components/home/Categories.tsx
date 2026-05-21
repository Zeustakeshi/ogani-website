import React from "react";

interface CategoryItem {
    id: number;
    name: string;
    bgImage: string;
}

interface CategoriesProps {
    items?: CategoryItem[];
}

const Categories: React.FC<CategoriesProps> = ({
    items = [
        { id: 1, name: "Fresh Fruit", bgImage: "img/categories/cat-1.jpg" },
        { id: 2, name: "Dried Fruit", bgImage: "img/categories/cat-2.jpg" },
        { id: 3, name: "Vegetables", bgImage: "img/categories/cat-3.jpg" },
        { id: 4, name: "drink fruits", bgImage: "img/categories/cat-4.jpg" },
        { id: 5, name: "drink fruits", bgImage: "img/categories/cat-5.jpg" },
    ],
}) => {
    return (
        <section className="categories">
            <div className="container">
                <div className="row">
                    <div className="categories__slider owl-carousel">
                        {items.map((cat) => (
                            <div key={cat.id} className="col-lg-3">
                                <div
                                    className="categories__item set-bg"
                                    data-setbg={cat.bgImage}
                                >
                                    <h5>
                                        <a href="#">{cat.name}</a>
                                    </h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;
