import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";

interface Category {
    id: string;
    name: string;
    description: string;
}

const HeroBanner: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) throw new Error("Failed to fetch categories");
                const data = await response.json();
                setCategories(data.data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="hero">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="hero__categories">
                            <div className="hero__categories__all">
                                <span style={{ fontSize: 15 }}>
                                    Danh mục sản phẩm
                                </span>
                            </div>
                            <ul
                                style={{
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                    paddingRight: "8px",
                                }}
                            >
                                {loading ? (
                                    <li
                                        style={{
                                            padding: "10px",
                                            color: "#999",
                                        }}
                                    >
                                        Đang tải...
                                    </li>
                                ) : categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <li key={cat.id}>
                                            <a href={`/category/${cat.id}`}>
                                                {cat.name}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li
                                        style={{
                                            padding: "10px",
                                            color: "#999",
                                        }}
                                    >
                                        Không có danh mục
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="hero__search">
                            <div className="hero__search__form">
                                <SearchBar />
                            </div>
                            <div className="hero__search__phone">
                                <div className="hero__search__phone__icon">
                                    <i className="fa fa-phone"></i>
                                </div>
                                <div className="hero__search__phone__text">
                                    <h5>+84 123456789</h5>
                                    <span>Hỗ trợ 24/7</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="hero__item set-bg"
                            data-setbg="img/hero/banner.jpg"
                        >
                            <div className="hero__text">
                                <span>FRUIT FRESH</span>
                                <h2>
                                    Vegetable <br />
                                    100% Organic
                                </h2>
                                <p>Free Pickup and Delivery Available</p>
                                <a href="#" className="primary-btn">
                                    Mua ngay
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
