import api from "@/services/api";
import Pagination from "@/components/ui/Pagination";
import { PATHS } from "@/router/paths";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type AdminProduct = {
    id: string;
    name: string;
    price: number;
    is_availability: boolean;
    images: string[];
};

type ProductListResponse = {
    data: AdminProduct[];
    meta?: {
        current_page?: number;
        last_page?: number;
        total?: number;
    };
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const priceFormatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    useEffect(() => {
        let isActive = true;

        (async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await api.get<ProductListResponse>(
                    "/products",
                    {
                        params: {
                            page: currentPage,
                            per_page: 10,
                        },
                    },
                );

                const payload = response.data;

                if (isActive) {
                    setProducts(payload?.data ?? []);
                    setTotalPages(Math.max(1, payload?.meta?.last_page ?? 1));
                    setTotalCount(payload?.meta?.total ?? 0);
                }
            } catch {
                if (isActive) {
                    setErrorMessage(
                        "Không thể tải danh sách sản phẩm. Vui lòng thử lại.",
                    );
                    setProducts([]);
                    setTotalPages(1);
                    setTotalCount(0);
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
    }, [currentPage]);

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">
                        Quản lý sản phẩm
                    </span>
                    <h1>Sản phẩm</h1>
                    <p>Danh sách toàn bộ sản phẩm hiện có trong database.</p>
                </div>
            </div>

            <div className="admin-page__table-card admin-page__table-card--products">
                <div className="admin-page__table-head">
                    <span>Hình ảnh</span>
                    <span>Tên sản phẩm</span>
                    <span>Mã sản phẩm</span>
                    <span>Trạng thái</span>
                    <span>Giá</span>
                    <span>Hành động</span>
                </div>

                <div className="admin-page__table-body">
                    {isLoading && (
                        <article className="admin-page__table-row">
                            <strong>Đang tải dữ liệu...</strong>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                        </article>
                    )}

                    {!isLoading && errorMessage && (
                        <article className="admin-page__table-row">
                            <strong>{errorMessage}</strong>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                        </article>
                    )}

                    {!isLoading && !errorMessage && products.length === 0 && (
                        <article className="admin-page__table-row">
                            <strong>Chưa có sản phẩm trong database.</strong>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                            <span>-</span>
                        </article>
                    )}

                    {!isLoading &&
                        !errorMessage &&
                        products.map((product) => (
                            <article
                                key={product.id}
                                className="admin-page__table-row"
                            >
                                <span>
                                    <img
                                        src={
                                            product.images?.[0] ||
                                            "/img/product/product-1.jpg"
                                        }
                                        alt={product.name}
                                        className="admin-page__product-thumbnail"
                                    />
                                </span>
                                <strong>{product.name}</strong>
                                <span>{product.id}</span>
                                <span>
                                    {product.is_availability
                                        ? "Đang bán"
                                        : "Ngừng bán"}
                                </span>
                                <span>
                                    {priceFormatter.format(product.price)}đ
                                </span>
                                <span>
                                    <Link
                                        to={PATHS.PRODUCT.replace(
                                            ":id",
                                            product.id,
                                        )}
                                        className="admin-page__view-link"
                                    >
                                        Xem sản phẩm
                                    </Link>
                                </span>
                            </article>
                        ))}
                </div>
            </div>

            {!isLoading && !errorMessage && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    onPageChange={setCurrentPage}
                />
            )}
        </section>
    );
}
