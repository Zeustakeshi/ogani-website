import CartActions from "@/components/cart/CartActions";
import CartSummary from "@/components/cart/CartSummary";
import CartTable from "@/components/cart/CartTable";
import CouponInput from "@/components/cart/CouponInput";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import api from "@/services/api";
import {
    clearStoredCouponCode,
    getStoredCouponCode,
    storeCouponCode,
    validateCouponCode,
    type CouponInfo,
} from "@/services/coupon";
import { PATHS } from "@/router/paths";
import React, { useEffect, useState } from "react";

interface CartPageProps {}

type CartItemResponse = {
    cart_id: string;
    product_id: string;
    amount: number;
    product?: {
        id: string;
        name?: string;
        price?: number;
        images?: string[];
    };
};

type CartListResponse = {
    data?: CartItemResponse[];
    meta?: {
        current_page?: number;
        last_page?: number;
        total?: number;
        per_page?: number;
    };
};

type CartSummaryResponse = {
    data?: {
        item_count?: number;
        total?: number;
    };
};

type CartRow = {
    id: string;
    productId: string;
    image: string;
    title: string;
    price: number;
    quantity: number;
    initialQuantity: number;
    total: number;
};

const fallbackImage = "/img/product/details/product-details-1.jpg";
const cartPageSize = 6;

const CartPage: React.FC<CartPageProps> = () => {
    const [items, setItems] = useState<CartRow[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [refreshTick, setRefreshTick] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);
    const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
    const [couponFeedbackTone, setCouponFeedbackTone] = useState<
        "success" | "error" | "info" | null
    >(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasUnsavedChanges = items.some(
        (item) => item.quantity !== item.initialQuantity,
    );
    const changedCount = items.filter(
        (item) => item.quantity !== item.initialQuantity,
    ).length;

    useEffect(() => {
        let isActive = true;

        (async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const [cartResponse, summaryResponse] = await Promise.all([
                    api.get<CartListResponse>("/cart", {
                        params: {
                            page: currentPage,
                            per_page: cartPageSize,
                        },
                    }),
                    api.get<CartSummaryResponse>("/cart/summary"),
                ]);

                if (!isActive) {
                    return;
                }

                const cartItems = cartResponse.data?.data ?? [];
                const meta = cartResponse.data?.meta;

                const normalizedItems = cartItems
                    .map((item) => {
                        const product = item.product;
                        const price = Number(product?.price ?? 0);
                        const quantity = Number(item.amount ?? 0);
                        const title = product?.name ?? "Sản phẩm";
                        const image = product?.images?.[0] ?? fallbackImage;

                        return {
                            id: item.product_id,
                            productId: item.product_id,
                            image,
                            title,
                            price,
                            quantity,
                            initialQuantity: quantity,
                            total: price * quantity,
                        };
                    })
                    .filter((item) => item.quantity > 0);

                const summary = summaryResponse.data?.data;
                const calculatedSubtotal = normalizedItems.reduce(
                    (sum, item) => sum + item.total,
                    0,
                );
                const summaryTotal = Number(
                    summary?.total ?? calculatedSubtotal,
                );

                setItems(normalizedItems);
                setCurrentPage(Number(meta?.current_page ?? currentPage));
                setTotalPages(Number(meta?.last_page ?? 1));
                setTotalCount(Number(meta?.total ?? normalizedItems.length));
                setSubtotal(summaryTotal);
                setTotal(summaryTotal);
            } catch {
                if (isActive) {
                    setErrorMessage(
                        "Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại.",
                    );
                    setItems([]);
                    setSubtotal(0);
                    setTotal(0);
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
    }, [currentPage, refreshTick]);

    useEffect(() => {
        let isActive = true;

        (async () => {
            const storedCouponCode = getStoredCouponCode();

            if (!storedCouponCode) {
                return;
            }

            try {
                const coupon = await validateCouponCode(storedCouponCode);

                if (!isActive) {
                    return;
                }

                if (coupon) {
                    setAppliedCoupon(coupon);
                    setCouponFeedback(
                        `Đã áp dụng coupon ${coupon.code} (-${coupon.discount_percent}%).`,
                    );
                    setCouponFeedbackTone("success");
                } else {
                    clearStoredCouponCode();
                    setAppliedCoupon(null);
                }
            } catch {
                if (isActive) {
                    clearStoredCouponCode();
                    setAppliedCoupon(null);
                    setCouponFeedback(
                        "Coupon đã lưu không còn hợp lệ. Vui lòng nhập lại.",
                    );
                    setCouponFeedbackTone("error");
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        const discountAmount = appliedCoupon
            ? Math.round((subtotal * appliedCoupon.discount_percent) / 100)
            : 0;

        setTotal(Math.max(0, subtotal - discountAmount));
    }, [appliedCoupon, subtotal]);

    const reloadCart = () => {
        setRefreshTick((value) => value + 1);
    };

    const handleQuantityChange = (productId: string, quantity: number) => {
        const safeQuantity = Math.max(1, quantity);

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId
                    ? {
                          ...item,
                          quantity: safeQuantity,
                          total: item.price * safeQuantity,
                      }
                    : item,
            ),
        );
    };

    const handleRemove = async (productId: string) => {
        try {
            await api.delete(`/cart/items/${productId}`);
            window.dispatchEvent(new Event("cart:updated"));
            reloadCart();
        } catch {
            setErrorMessage(
                "Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.",
            );
        }
    };

    const handleApplyCoupon = async (code: string) => {
        const normalizedCode = code.trim().toUpperCase();

        if (!normalizedCode) {
            setCouponFeedback("Vui lòng nhập mã coupon.");
            setCouponFeedbackTone("error");
            return;
        }

        setIsApplyingCoupon(true);
        setCouponFeedback(null);
        setCouponFeedbackTone(null);

        try {
            const coupon = await validateCouponCode(normalizedCode);

            if (!coupon) {
                throw new Error("Coupon không hợp lệ.");
            }

            storeCouponCode(coupon.code);
            setAppliedCoupon(coupon);
            setCouponFeedback(
                `Đã áp dụng coupon ${coupon.code} (-${coupon.discount_percent}%).`,
            );
            setCouponFeedbackTone("success");
        } catch (error: any) {
            clearStoredCouponCode();
            setAppliedCoupon(null);
            setCouponFeedback(
                error?.response?.data?.message ||
                    error?.message ||
                    "Coupon không hợp lệ hoặc đã hết hạn.",
            );
            setCouponFeedbackTone("error");
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleUpdateCart = async () => {
        const changedItems = items.filter(
            (item) => item.quantity !== item.initialQuantity,
        );

        if (changedItems.length === 0) {
            window.dispatchEvent(new Event("cart:updated"));
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        try {
            await Promise.all(
                changedItems.map((item) =>
                    api.patch(`/cart/items/${item.productId}`, {
                        amount: item.quantity,
                    }),
                ),
            );

            window.dispatchEvent(new Event("cart:updated"));
            reloadCart();
        } catch {
            setErrorMessage("Không thể cập nhật giỏ hàng. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Giỏ hàng" },
    ];

    return (
        <>
            <section className="shoping-cart spad">
                <div className="container">
                    {isLoading && (
                        <div className="row">
                            <div className="col-lg-12">
                                <p>Đang tải dữ liệu giỏ hàng...</p>
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
                        <div className="col-lg-12">
                            <CartTable
                                items={items}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalCount={totalCount}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <CartActions
                                continueHref={PATHS.SHOP}
                                continueText="Tiếp tục mua sắm"
                                updateText="Cập nhật giỏ hàng"
                                isDirty={hasUnsavedChanges}
                                dirtyCount={changedCount}
                                onUpdateCart={handleUpdateCart}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="shoping__continue">
                                <CouponInput
                                    onApply={handleApplyCoupon}
                                    isApplying={isApplyingCoupon}
                                    feedbackMessage={couponFeedback}
                                    feedbackTone={couponFeedbackTone}
                                />
                                {appliedCoupon ? (
                                    <p
                                        style={{
                                            marginTop: 12,
                                            marginBottom: 0,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#4f7d1f",
                                        }}
                                    >
                                        Coupon hiện tại: {appliedCoupon.code} -
                                        giảm {appliedCoupon.discount_percent}%
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <CartSummary
                                subtotal={subtotal}
                                total={total}
                                checkoutHref={PATHS.CHECKOUT}
                                title="Tổng tiền giỏ hàng"
                                subtotalLabel="Tạm tính"
                                totalLabel="Thành tiền"
                                checkoutText="TIẾN HÀNH THANH TOÁN"
                            />
                        </div>
                    </div>
                    {isSaving && (
                        <div className="row">
                            <div className="col-lg-12">
                                <p>Đang cập nhật giỏ hàng...</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default CartPage;
