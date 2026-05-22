import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/router/paths";
import React from "react";
import { NavLink } from "react-router-dom";

const adminMenu = [
    {
        label: "Tổng quan",
        to: PATHS.ADMIN,
        icon: "fa-dashboard",
    },
    {
        label: "Quản lý sản phẩm",
        to: `${PATHS.ADMIN}/products`,
        icon: "fa-cubes",
    },
    {
        label: "Quản lý khuyến mãi",
        to: `${PATHS.ADMIN}/coupons`,
        icon: "fa-tags",
    },
    {
        label: "Quản lý đơn hàng",
        to: `${PATHS.ADMIN}/orders`,
        icon: "fa-shopping-cart",
    },
];

export default function AdminSidebar() {
    const { user, logout } = useAuth();

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__brand">
                <span className="admin-sidebar__eyebrow">Ogani Admin</span>
                <h2>Khu quản trị</h2>
                <p>
                    Xin chào {user?.username || "quản trị viên"}, hãy chọn mục
                    cần thao tác.
                </p>
            </div>

            <nav className="admin-sidebar__nav" aria-label="Điều hướng admin">
                {adminMenu.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === PATHS.ADMIN}
                        className={({ isActive }) =>
                            `admin-sidebar__link${isActive ? " is-active" : ""}`
                        }
                    >
                        <i className={`fa ${item.icon}`} aria-hidden="true" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button
                type="button"
                className="admin-sidebar__logout"
                onClick={() => logout(PATHS.ADMIN_LOGIN)}
            >
                <i className="fa fa-sign-out" aria-hidden="true" />
                <span>Đăng xuất</span>
            </button>
        </aside>
    );
}
