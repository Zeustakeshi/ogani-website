import ProductTabs from "@/components/common/ProductTabs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import Breadcrumb from "@/components/ui/Breadcrumb";
import api from "@/services/api";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

interface ProductDetailPageProps {}

type ProductDetail = {
    id: string;
    category_id: string;
    name: string;
    reviews: number;
    rating: number;
    price: number;
    description: string;
    is_availability: boolean;
    weight: number;
    inventory: number;
    images: string[];
};

type Category = {
    id: string;
    name: string;
};

type ProductDetailResponse = {
    data?: ProductDetail;
} & Partial<ProductDetail>;

type CategoryListResponse = {
    data: Category[];
};

type ProductListItem = {
    id: string;
    name: string;
    price: number;
    images: string[];
};

type ProductListResponse = {
    data: ProductListItem[];
};

type ProductReviewItem = {
    id: number;
    user_id: number;
    product_id: string;
    user?: {
        id: number;
        username?: string | null;
    } | null;
    review_text: string;
    rating: number;
    created_at?: string;
};

type ProductReviewListResponse = {
    data?: ProductReviewItem[];
};

type CurrentUser = {
    id: number;
    username?: string | null;
};

type CurrentUserResponse = {
    data?: CurrentUser;
} & Partial<CurrentUser>;

const fallbackImage = "/img/product/details/product-details-1.jpg";

const normalizeProduct = (
    payload: ProductDetailResponse | undefined,
): ProductDetail | null => {
    const product = payload?.data ?? payload;

    if (!product?.id) {
        return null;
    }

    return {
        id: String(product.id),
        category_id: String(product.category_id ?? ""),
        name: product.name ?? "",
        reviews: Number(product.reviews ?? 0),
        rating: Number(product.rating ?? 0),
        price: Number(product.price ?? 0),
        description: product.description ?? "",
        is_availability: Boolean(product.is_availability),
        weight: Number(product.weight ?? 0),
        inventory: Number(product.inventory ?? 0),
        images: Array.isArray(product.images) ? product.images : [],
    };
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>(
        [],
    );
    const [reviews, setReviews] = useState<ProductReviewItem[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReviewsLoading, setIsReviewsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshTick, setRefreshTick] = useState(0);

    const priceFormatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    useEffect(() => {
        if (!id) {
            setErrorMessage("Không tìm thấy sản phẩm.");
            setIsLoading(false);
            setIsReviewsLoading(false);
            return;
        }

        let isActive = true;

        (async () => {
            setIsLoading(true);
            setIsReviewsLoading(true);
            setErrorMessage(null);

            try {
                const [productResponse, categoryResponse] = await Promise.all([
                    api.get<ProductDetailResponse>(`/products/${id}`),
                    api.get<CategoryListResponse>("/categories", {
                        params: { per_page: 100 },
                    }),
                ]);

                if (!isActive) {
                    return;
                }

                const normalizedProduct = normalizeProduct(
                    productResponse.data,
                );

                setCategories(categoryResponse.data?.data ?? []);

                if (!normalizedProduct) {
                    setProduct(null);
                    setRelatedProducts([]);
                    setErrorMessage("Không thể tải thông tin sản phẩm.");
                    return;
                }

                setProduct(normalizedProduct);

                if (normalizedProduct.category_id) {
                    try {
                        const relatedResponse =
                            await api.get<ProductListResponse>("/products", {
                                params: {
                                    category_id: normalizedProduct.category_id,
                                    per_page: 4,
                                },
                            });

                        if (!isActive) {
                            return;
                        }

                        setRelatedProducts(
                            (relatedResponse.data?.data ?? [])
                                .filter(
                                    (item) =>
                                        String(item.id) !==
                                        normalizedProduct.id,
                                )
                                .slice(0, 4),
                        );
                    } catch {
                        if (isActive) {
                            setRelatedProducts([]);
                        }
                    }
                } else {
                    setRelatedProducts([]);
                }

                try {
                    const reviewResponse =
                        await api.get<ProductReviewListResponse>(
                            `/products/${id}/reviews`,
                            {
                                params: { per_page: 100 },
                            },
                        );

                    if (isActive) {
                        setReviews(reviewResponse.data?.data ?? []);
                    }
                } catch {
                    if (isActive) {
                        setReviews([]);
                    }
                }

                try {
                    const userResponse = await api.get<CurrentUserResponse>(
                        "/me",
                        {
                            suppressUnauthorizedRedirect: true,
                        } as any,
                    );

                    if (isActive) {
                        const userPayload =
                            userResponse.data?.data ?? userResponse.data;

                        if (userPayload?.id) {
                            setCurrentUser({
                                id: userPayload.id,
                                username: userPayload.username ?? null,
                            });
                        } else {
                            setCurrentUser(null);
                        }
                    }
                } catch {
                    if (isActive) {
                        setCurrentUser(null);
                    }
                }
            } catch {
                if (isActive) {
                    setErrorMessage(
                        "Không thể tải thông tin sản phẩm. Vui lòng thử lại.",
                    );
                    setProduct(null);
                    setCategories([]);
                    setRelatedProducts([]);
                    setReviews([]);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                    setIsReviewsLoading(false);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [id, refreshTick]);

    const categoryName =
        categories.find((category) => category.id === product?.category_id)
            ?.name ?? "Danh mục";

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        {
            label: categoryName,
            path: product?.category_id
                ? `/shop?category_id=${encodeURIComponent(product.category_id)}`
                : "/shop",
        },
        { label: product?.name ?? "Đang tải..." },
    ];

    const galleryImages = product?.images ?? [];
    const mainImage = galleryImages[0] ?? fallbackImage;
    const thumbnails = galleryImages.slice(1).map((image) => ({
        bigImage: image,
        thumbnailImage: image,
    }));
    const descriptionParagraphs = product?.description
        ? product.description
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
        : [];
    const displayPrice = product
        ? `${priceFormatter.format(product.price)}đ`
        : "";
    const hasUserReview = Boolean(
        currentUser &&
        reviews.some((review) => review.user_id === currentUser.id),
    );

    return (
        <>
            <Breadcrumb
                items={breadcrumbItems}
                backgroundImage="/img/breadcrumb.jpg"
            />
            <section className="product-details spad">
                <div className="container">
                    {isLoading && (
                        <div className="row">
                            <div className="col-lg-12">
                                <p>Đang tải thông tin sản phẩm...</p>
                            </div>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="row">
                            <div className="col-lg-12">
                                <p>{errorMessage}</p>
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <ProductGallery
                                mainImage={mainImage}
                                thumbnails={thumbnails}
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <ProductInfo
                                reviews={reviews}
                                title={product?.name}
                                reviewsCount={product?.reviews}
                                price={displayPrice}
                                description={product?.description}
                                image={mainImage}
                                productId={product?.id}
                                availability={product?.is_availability}
                                weight={product?.weight}
                                inventory={product?.inventory}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <ProductTabs
                                description={
                                    descriptionParagraphs.length > 0
                                        ? descriptionParagraphs
                                        : undefined
                                }
                                reviewsCount={product?.reviews}
                                productId={product?.id}
                                reviews={reviews}
                                currentUser={currentUser}
                                isReviewsLoading={isReviewsLoading}
                                hasUserReview={hasUserReview}
                                onReviewSubmitted={() => {
                                    setRefreshTick((value) => value + 1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <RelatedProducts
                products={relatedProducts.map((relatedProduct) => ({
                    id: relatedProduct.id,
                    image: relatedProduct.images?.[0] ?? fallbackImage,
                    title: relatedProduct.name,
                    price: `${priceFormatter.format(relatedProduct.price)}đ`,
                    link: `/product/${relatedProduct.id}`,
                }))}
            />
        </>
    );
};

export default ProductDetailPage;
