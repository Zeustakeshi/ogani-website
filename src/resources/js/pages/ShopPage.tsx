import Pagination from "@/components/ui/Pagination";
import ProductGrid from "@/components/common/ProductGrid";
import ProductCount from "@/components/shop/ProductCount";
import ShopSidebar from "@/components/shop/ShopSidebar";
import SortBar from "@/components/shop/SortBar";
import { PATHS } from "@/router/paths";
import api from "@/services/api";
import { useEffect, useMemo, useState } from "react";

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
    const [products, setProducts] = useState<ShopProduct[]>([]);
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
                            per_page: 9,
                        },
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
    }, [currentPage]);

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
                                    <SortBar />
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
