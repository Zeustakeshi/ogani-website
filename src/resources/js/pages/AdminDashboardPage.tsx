import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/router/paths";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);

    useEffect(() => {
        let isActive = true;

        (async () => {
            if (user?.role === "admin") {
                if (isActive) {
                    setIsCheckingAccess(false);
                }

                return;
            }

            try {
                const response = await fetch("/api/me", {
                    credentials: "include",
                });

                if (!response.ok) {
                    navigate(PATHS.HOME, { replace: true });
                    return;
                }

                const data = await response.json();
                const payload = data.data ?? data;

                if (payload?.role !== "admin") {
                    navigate(PATHS.HOME, { replace: true });
                    return;
                }
            } catch {
                navigate(PATHS.HOME, { replace: true });
                return;
            }

            if (isActive) {
                setIsCheckingAccess(false);
            }
        })();

        return () => {
            isActive = false;
        };
    }, [navigate, user]);

    if (isCheckingAccess) {
        return null;
    }

    return (
        <section className="admin-dashboard-page">
            <div className="admin-dashboard-page__card">
                <span className="admin-dashboard-page__eyebrow">Admin</span>
                <h1>Bảng điều khiển quản trị</h1>
                <p>
                    Bạn đã đăng nhập thành công vào khu admin. Từ đây có thể mở
                    các module quản trị sản phẩm, đơn hàng và người dùng.
                </p>
            </div>
        </section>
    );
}
