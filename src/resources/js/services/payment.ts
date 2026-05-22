import api from "@/services/api";

export type MomoCreateCheckoutResponse = {
    success: boolean;
    message: string;
    data?: {
        orderId?: string;
        payUrl?: string;
    };
};

export type MomoCallbackResponse = {
    success: boolean;
    message: string;
    data?: {
        order_id?: string;
        status?: string;
    };
};

export type MomoCallbackPayload = Record<string, string>;

export const createMomoCheckout = () => {
    return api.post<MomoCreateCheckoutResponse>("/payment/momo/checkout");
};

export const sendMomoCallback = (payload: MomoCallbackPayload) => {
    return api.post<MomoCallbackResponse>("/payment/momo/callback", payload);
};