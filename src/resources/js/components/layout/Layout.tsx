import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { PATHS } from "../../router/paths";

export default function Layout() {
    return (
        <>
            <header className="site-header">
                <nav>
                    <ul className="nav-list">
                        <li>
                            <NavLink to={PATHS.HOME} end>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={PATHS.SHOP}>Shop</NavLink>
                        </li>
                        <li>
                            <NavLink to={PATHS.CART}>Cart</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="site-main">
                <Outlet />
            </main>
            <footer className="site-footer">
                <small>© {new Date().getFullYear()} My App</small>
            </footer>
        </>
    );
}
