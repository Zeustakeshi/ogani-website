import api from "@/services/api";

export type CouponInfo = {
    id: number;
    code: string;
    name: string;
    description: string;
    discount_percent: number;
    expire_at: string;
};

type ValidateCouponResponse = {
    success: boolean;
    message: string;
    data?: CouponInfo;
};

const COUPON_STORAGE_KEY = "ogani:selected_coupon_code";

export const getStoredCouponCode = (): string | null => {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem(COUPON_STORAGE_KEY);
};

export const storeCouponCode = (code: string) => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(COUPON_STORAGE_KEY, code);
};

export const clearStoredCouponCode = () => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(COUPON_STORAGE_KEY);
};

export const validateCouponCode = async (code: string) => {
    const response = await api.post<ValidateCouponResponse>(
        "/coupons/validate",
        { code },
        { suppressUnauthorizedRedirect: true } as any,
    );

    return response.data?.data ?? null;
};