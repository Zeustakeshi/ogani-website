import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import router from "./router";
import { AuthProvider } from "./context/AuthContext";
import "../css/app.css";

const root = document.getElementById("root");
if (root)
    createRoot(root).render(
        <AuthProvider>
            <App router={router} />
        </AuthProvider>,
    );
