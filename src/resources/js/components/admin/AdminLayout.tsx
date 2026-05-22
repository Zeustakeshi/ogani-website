import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
    return (
        <section className="admin-layout">
            <AdminSidebar />

            <div className="admin-layout__content">
                <main className="admin-layout__main">
                    <Outlet />
                </main>
            </div>
        </section>
    );
}
