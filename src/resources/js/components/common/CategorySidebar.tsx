import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useSearchParams } from "react-router-dom";

interface Category {
    id: string;
    name: string;
}

interface CategorySidebarProps {}

const CategorySidebar: React.FC<CategorySidebarProps> = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const active = searchParams.get("category_id") || "";

    useEffect(() => {
        let isActive = true;
        (async () => {
            try {
                const res = await api.get<{ data: Category[] }>("/categories");
                if (!isActive) return;
                setCategories(res.data?.data || []);
            } catch (err) {
                // ignore errors silently
            }
        })();

        return () => {
            isActive = false;
        };
    }, []);

    const selectCategory = (id?: string) => {
        const next = new URLSearchParams(searchParams as any);
        if (!id) {
            next.delete("category_id");
        } else {
            next.set("category_id", id);
        }
        next.delete("page");
        setSearchParams(next);
    };

    return (
        <div className="sidebar__item">
            <div className="">
                <ul
                    style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        paddingRight: "8px",
                    }}
                >
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                selectCategory();
                            }}
                            className={!active ? "active" : ""}
                        >
                            Tất cả
                        </a>
                    </li>
                    {categories.map((c) => (
                        <li key={c.id}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    selectCategory(c.id);
                                }}
                                className={
                                    active === String(c.id) ? "active" : ""
                                }
                            >
                                {c.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategorySidebar;
