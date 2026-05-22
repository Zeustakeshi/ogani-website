import CheckoutLayout from "@/components/checkout/CheckoutLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import api from "@/services/api";
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

                setSubtotal(calculatedSubtotal);
                setTotal(
                    Number(
                        summaryResponse.data?.data?.total ?? calculatedSubtotal,
                    ),
                );
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
