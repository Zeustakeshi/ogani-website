import Pagination from "@/components/ui/Pagination";
import ProductGrid from "@/components/common/ProductGrid";
import ProductCount from "@/components/shop/ProductCount";
import ShopSidebar from "@/components/shop/ShopSidebar";
import SortBar from "@/components/shop/SortBar";
import { PATHS } from "@/router/paths";
import api from "@/services/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type ShopProduct = {
    id: string;
    name: string;
    price: number;
    images: string[];
};

type ProductListResponse = {
    data: ShopProduct[];
    meta?: {
        current_page?: number;
        last_page?: number;
        total?: number;
    };
};

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const categoryId = searchParams.get("category_id");
    const searchTerm = searchParams.get("search");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const minWeight = searchParams.get("min_weight");
    const maxWeight = searchParams.get("max_weight");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const sort = searchParams.get("sort");
    const queryString = searchParams.toString();
    const previousQueryStringRef = useRef(queryString);

    const priceFormatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    useEffect(() => {
        let isActive = true;
        const isQueryChanged = previousQueryStringRef.current !== queryString;
        const pageToLoad = isQueryChanged ? 1 : currentPage;

        if (isQueryChanged && currentPage !== 1) {
            setCurrentPage(1);
        }

        previousQueryStringRef.current = queryString;

        (async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const params: any = {
                    page: pageToLoad,
                    per_page: 9,
                };

                if (categoryId) {
                    params.category_id = categoryId;
                }
                if (searchTerm) {
                    params.search = searchTerm;
                }
                if (minPrice) {
                    params.min_price = Number(minPrice);
                }
                if (maxPrice) {
                    params.max_price = Number(maxPrice);
                }
                if (minWeight) {
                    params.min_weight = Number(minWeight);
                }
                if (maxWeight) {
                    params.max_weight = Number(maxWeight);
                }
                if (color) {
                    params.color = color;
                }
                if (size) {
                    params.size = size;
                }
                if (sort) {
                    params.sort = sort;
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

                const payload = response.data;
                setProducts(payload?.data ?? []);
                setTotalPages(Math.max(1, payload?.meta?.last_page ?? 1));
                setTotalCount(payload?.meta?.total ?? 0);
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
    }, [currentPage, queryString]);

    const productItems = products.map((product) => ({
        id: product.id,
        image: product.images?.[0] || "/img/product/product-1.jpg",
        title: product.name,
        price: `${priceFormatter.format(product.price)}đ`,
        link: PATHS.PRODUCT.replace(":id", product.id),
    }));

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-5">
                        <ShopSidebar />
                    </div>
                    <div className="col-lg-9 col-md-7">
                        <div className="filter__item">
                            <div className="row">
                                <div className="col-lg-4 col-md-5">
                                    <SortBar
                                        value={sort ?? ""}
                                        onSortChange={(value) => {
                                            const next = new URLSearchParams(
                                                searchParams as any,
                                            );
                                            if (!value) next.delete("sort");
                                            else next.set("sort", value);
                                            next.delete("page");
                                            setSearchParams(next);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <ProductCount count={totalCount} />
                                </div>
                                <div className="col-lg-4 col-md-3">
                                    <div className="filter__option">
                                        <span className="icon_grid-2x2"></span>
                                        <span className="icon_ul"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isLoading && <p>Đang tải sản phẩm...</p>}
                        {!isLoading && errorMessage && <p>{errorMessage}</p>}

                        {!isLoading && !errorMessage && (
                            <>
                                <ProductGrid products={productItems} />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalCount={totalCount}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopPage;
