import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { PATHS } from "./paths";

const routes = [
    {
        path: PATHS.ADMIN_LOGIN.replace(/^\//, ""),
        element: <AdminLoginPage />,
    },
    {
        path: PATHS.ADMIN.replace(/^\//, ""),
        element: <AdminRouteGuard />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: "products",
                        element: <AdminProductsPage />,
                    },
                    {
                        path: "orders",
                        element: <AdminOrdersPage />,
                    },
                    {
                        path: "*",
                        element: <Navigate to={PATHS.ADMIN} replace />,
                    },
                ],
            },
        ],
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: PATHS.SHOP.replace(/^\//, ""), element: <ShopPage /> },
            {
                path: PATHS.PRODUCT.replace(/^\//, ""),
                element: <ProductDetailPage />,
            },
            { path: PATHS.CART.replace(/^\//, ""), element: <CartPage /> },
            {
                path: PATHS.CHECKOUT.replace(/^\//, ""),
                element: <CheckoutPage />,
            },
            { path: PATHS.LOGIN.replace(/^\//, ""), element: <LoginPage /> },
            {
                path: PATHS.REGISTER.replace(/^\//, ""),
                element: <Register />,
            },
            {
                path: PATHS.FORGOT_PASSWORD.replace(/^\//, ""),
                element: <ForgotPasswordPage />,
            },
            { path: "*", element: <Navigate to={PATHS.HOME} replace /> },
        ],
    },
];

const router = createBrowserRouter(routes);

export default router;
export { routes };
