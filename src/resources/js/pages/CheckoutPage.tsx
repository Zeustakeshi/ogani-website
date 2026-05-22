import CheckoutLayout from "@/components/checkout/CheckoutLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import api from "@/services/api";
import {
    clearStoredCouponCode,
    getStoredCouponCode,
    validateCouponCode,
    type CouponInfo,
} from "@/services/coupon";
import { createMomoCheckout } from "@/services/payment";
import React from "react";
import { useEffect, useState } from "react";

interface CheckoutPageProps {}

type CheckoutCartItemResponse = {
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

type CheckoutCartListResponse = {
    data?: CheckoutCartItemResponse[];
};

type CheckoutCartSummaryResponse = {
    data?: {
        item_count?: number;
        total?: number;
    };
};

type CheckoutItem = {
    image: string;
    name: string;
    price: number;
    quantity: number;
};

type CheckoutFormState = {
    address: string;
    orderNote: string;
};

const fallbackImage = "/img/product/details/product-details-1.jpg";

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Thanh toán" },
    ];

    const [items, setItems] = useState<CheckoutItem[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);
    const [billingForm, setBillingForm] = useState<CheckoutFormState>({
        address: "",
        orderNote: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        (async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const [cartResponse, summaryResponse] = await Promise.all([
                    api.get<CheckoutCartListResponse>("/cart", {
                        params: {
                            per_page: 100,
                        },
                    }),
                    api.get<CheckoutCartSummaryResponse>("/cart/summary"),
                ]);

                if (!isActive) {
                    return;
                }

                const normalizedItems = (cartResponse.data?.data ?? [])
                    .map((item) => {
                        const product = item.product;
                        const price = Number(product?.price ?? 0);
                        const quantity = Number(item.amount ?? 0);

                        return {
                            image: product?.images?.[0] ?? fallbackImage,
                            name: product?.name ?? "Sản phẩm",
                            price: price * quantity,
                            quantity,
                        };
                    })
                    .filter((item) => item.quantity > 0);

                setItems(normalizedItems);
                const calculatedSubtotal = normalizedItems.reduce(
                    (sum, item) => sum + item.price,
                    0,
                );
                const summaryTotal = Number(
                    summaryResponse.data?.data?.total ?? calculatedSubtotal,
                );

                setSubtotal(summaryTotal);
                setTotal(summaryTotal);
            } catch {
                if (isActive) {
                    setErrorMessage(
                        "Không thể tải thông tin thanh toán. Vui lòng thử lại.",
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
    }, []);

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
                } else {
                    clearStoredCouponCode();
                    setAppliedCoupon(null);
                }
            } catch {
                if (isActive) {
                    clearStoredCouponCode();
                    setAppliedCoupon(null);
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

    const handlePlaceOrder = async () => {
        if (!billingForm.address.trim()) {
            setErrorMessage("Vui lòng nhập địa chỉ giao hàng.");
            return;
        }

        setIsPlacingOrder(true);
        setErrorMessage(null);

        try {
            const response = await createMomoCheckout({
                address: billingForm.address,
                note: billingForm.orderNote,
                couponCode: appliedCoupon?.code,
            });
            const payUrl = response.data?.data?.payUrl;

            if (!payUrl) {
                throw new Error(
                    "Không nhận được đường dẫn thanh toán từ MoMo.",
                );
            }

            window.location.assign(payUrl);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể khởi tạo thanh toán. Vui lòng thử lại.";

            setErrorMessage(message);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            {appliedCoupon ? (
                <div className="container" style={{ marginBottom: 24 }}>
                    <div
                        style={{
                            padding: "14px 18px",
                            background: "rgba(127, 173, 57, 0.10)",
                            border: "1px solid rgba(127, 173, 57, 0.22)",
                            color: "#4f7d1f",
                            fontWeight: 600,
                        }}
                    >
                        Đang áp dụng coupon {appliedCoupon.code} (-
                        {appliedCoupon.discount_percent}%).
                    </div>
                </div>
            ) : null}
            <CheckoutLayout
                items={items}
                subtotal={subtotal}
                total={total}
                isLoading={isLoading}
                errorMessage={errorMessage}
                isPlacingOrder={isPlacingOrder}
                onPlaceOrder={handlePlaceOrder}
                billingForm={{
                    address: billingForm.address,
                    orderNote: billingForm.orderNote,
                    onAddressChange: (value) =>
                        setBillingForm((current) => ({
                            ...current,
                            address: value,
                        })),
                    onOrderNoteChange: (value) =>
                        setBillingForm((current) => ({
                            ...current,
                            orderNote: value,
                        })),
                }}
            />
        </>
    );
};

export default CheckoutPage;
