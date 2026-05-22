import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type ApiRequestConfig = InternalAxiosRequestConfig & {
    suppressUnauthorizedRedirect?: boolean;
};

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const getCookie = (name: string) => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            if (match) return decodeURIComponent(match[2]);
            return null;
        };

        const token = localStorage.getItem("token") || getCookie('token');

        if (token) {
            if (typeof config.headers.set === "function") {
                config.headers.set("Authorization", `Bearer ${token}`);
            } else {
                (config.headers as any).Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const requestConfig = error.config as ApiRequestConfig | undefined;

        if (
            error.response?.status === 401 &&
            !requestConfig?.suppressUnauthorizedRedirect
        ) {
            localStorage.removeItem("token");

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;