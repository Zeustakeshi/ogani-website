import React, { useEffect, useMemo, useState } from "react";
import api from "@/services/api";

interface FeaturedProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    rating: number;
}

interface Category {
    id: string;
    name: string;
}

type ProductListResponse = {
    data: FeaturedProduct[];
};

type CategoryListResponse = {
    data: Category[];
};

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<FeaturedProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const priceFormatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    const getRandomCategories = (items: Category[], count: number) => {
        const copy = [...items];

        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }

        return copy.slice(0, Math.min(count, copy.length));
    };

    useEffect(() => {
        let isActive = true;

        (async () => {
            try {
                const response = await api.get<CategoryListResponse>(
                    "/categories",
                    {
                        params: {
                            per_page: 100,
                        },
                    },
                );

                if (!isActive) {
                    return;
                }

                const allCategories = response.data?.data ?? [];

                // Keep only categories that have at least one product.
                // Do lightweight checks in parallel (per_page=1).
                const checks = allCategories.map((cat) =>
                    api
                        .get<ProductListResponse>("/products", {
                            params: { category_id: cat.id, per_page: 1 },
                        })
                        .then((res) => ({
                            id: cat.id,
                            has: (res.data?.data ?? []).length > 0,
                        }))
                        .catch(() => ({ id: cat.id, has: false })),
                );

                const results = await Promise.all(checks);

                const categoriesWithProducts = allCategories.filter((cat) =>
                    results.some((r) => r.id === cat.id && r.has),
                );

                const randomCategories = getRandomCategories(
                    categoriesWithProducts,
                    4,
                );

                setCategories(randomCategories);
            } catch {
                if (isActive) {
                    setErrorMessage(
                        "Không thể tải danh sách danh mục. Vui lòng thử lại sau.",
                    );
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        let isActive = true;

        (async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const params: Record<string, string | number> = {
                    sort_by: "rating",
                    order: "desc",
                    per_page: 4,
                };

                if (selectedCategoryId) {
                    params.category_id = selectedCategoryId;
                }

                const response = await api.get<ProductListResponse>(
                    "/products",
                    {
                        params,
                    },
                );

                if (!isActive) {
                    return;
                }

                setProducts(response.data?.data ?? []);
            } catch {
                if (isActive) {
                    setErrorMessage(
                        "Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.",
                    );
                    setProducts([]);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [selectedCategoryId]);

    const tabs = [
        { id: null, name: "Tất cả" },
        ...categories.map((category) => ({
            id: category.id,
            name: category.name,
        })),
    ];

    const productItems = products.map((product) => ({
        ...product,
        image: product.images?.[0] || "img/featured/feature-1.jpg",
    }));

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
                                        key={tab.id ?? "all"}
                                        className={
                                            selectedCategoryId === tab.id
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedCategoryId(tab.id)
                                        }
                                        data-filter={
                                            tab.id ? `.${tab.id}` : "*"
                                        }
                                    >
                                        {tab.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row featured__filter">
                    {isLoading && (
                        <div className="col-12 text-center py-5">
                            Đang tải sản phẩm...
                        </div>
                    )}

                    {errorMessage && !isLoading && (
                        <div className="col-12 text-center text-danger py-5">
                            {errorMessage}
                        </div>
                    )}

                    {!isLoading &&
                        !errorMessage &&
                        productItems.length === 0 && (
                            <div className="col-12 text-center py-5">
                                Không có sản phẩm nào.
                            </div>
                        )}

                    {productItems.map((product) => (
                        <div
                            key={product.id}
                            className="col-lg-3 col-md-4 col-sm-6 mix"
                        >
                            <div className="featured__item">
                                <div
                                    className="featured__item__pic set-bg"
                                    style={{
                                        backgroundImage: `url(${product.image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
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
                                        <a href="#">{product.name}</a>
                                    </h6>
                                    <h5>
                                        {priceFormatter.format(product.price)}đ
                                    </h5>
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
