import React from "react";
import { RouterProvider } from "react-router-dom";

type AppProps = {
    router: any;
};

export default function App({ router }: AppProps) {
    return <RouterProvider router={router} />;
}
