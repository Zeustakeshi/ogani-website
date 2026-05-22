import React, { useEffect, useState } from "react";

interface CategoryItem {
    id: string;
    name: string;
    description: string;
    bgImage: string;
}

interface CategoriesProps {
    items?: CategoryItem[];
}

const Categories: React.FC<CategoriesProps> = ({ items: initialItems }) => {
    const [items, setItems] = useState<CategoryItem[]>(initialItems || []);
    const [loading, setLoading] = useState(!initialItems);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialItems) return;

        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/categories");
                if (!response.ok) throw new Error("Failed to fetch categories");

                const data = await response.json();
                const categories = data.data.map((cat: any, index: number) => ({
                    ...cat,
                    bgImage: `img/categories/cat-${(index % 5) + 1}.jpg`,
                }));

                setItems(categories);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred",
                );
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [initialItems]);

    if (loading) {
        return (
            <section className="categories">
                <div className="container">
                    <div className="row">
                        <div className="text-center py-5">
                            Loading categories...
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        console.error("Categories error:", error);
        return null;
    }

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
