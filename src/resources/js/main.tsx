import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import router from "./router";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App router={router} />);
