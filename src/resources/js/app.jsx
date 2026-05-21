import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import Button from "./components/ui/Button";

const TodoList = () => {
    return <h1>xin chao cac ban </h1>;
};

const TodoList2 = () => {
    return <h2>xin chao moi nguoi</h2>;
};

const HelloCard = () => {
    return <h1>hello world</h1>;
};

const App = () => {
    return (
        <h1>
            Laravel 11 + React + Vite 🚀
            <HelloCard></HelloCard>
            <Button></Button>
            <TodoList />
            <TodoList2></TodoList2>
        </h1>
    );
};

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
