import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
    id: string;
    name: string;
    description: string;
}

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (selectedCategory) params.append("category_id", selectedCategory);
        if (searchTerm) params.append("search", searchTerm);

        const query = params.toString();
        navigate(`/shop${query ? "?" + query : ""}`);
    };

    return (
        <div className="header__search">
            <form onSubmit={handleSubmit}>
                <div
                    className="hero__search__categories"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            padding: "10px",
                            border: "none",
                            borderRadius: "0",
                            background: "transparent",
                            color: "#333",
                            minWidth: "180px",
                            appearance: "none",
                        }}
                    >
                        <option value="">
                            {loading ? "Đang tải..." : "Tất cả"}
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <span
                        className="arrow_carrot-down"
                        style={{ marginLeft: "8px" }}
                    ></span>
                </div>
                <input
                    type="text"
                    placeholder="Hôm nay bạn muốn tìm gì?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="site-btn">
                    Tìm kiếm
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
