import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import { PATHS } from "./paths";

const routes = [
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
            { path: "*", element: <Navigate to={PATHS.HOME} replace /> },
        ],
    },
];

const router = createBrowserRouter(routes);

export default router;
export { routes };
