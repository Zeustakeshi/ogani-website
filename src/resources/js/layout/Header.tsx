import React from "react";
import { Link, NavLink } from "react-router-dom";
import { PATHS } from "@/router/paths";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            {/* Header Top */}
            <div className="header__top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="header__top__left">
                                <ul>
                                    <li>
                                        <i className="fa fa-envelope"></i>{" "}
                                        hello@colorlib.com
                                    </li>
                                    <li>Free Shipping for all Order of $99</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="header__top__right">
                                <div className="header__top__right__social">
                                    <a href="#">
                                        <i className="fa fa-facebook"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fa fa-twitter"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fa fa-linkedin"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fa fa-pinterest-p"></i>
                                    </a>
                                </div>
                                <div className="header__top__right__language">
                                    <img src="img/language.png" alt="" />
                                    <div>English</div>
                                    <span className="arrow_carrot-down"></span>
                                    <ul>
                                        <li>
                                            <a href="#">Spanis</a>
                                        </li>
                                        <li>
                                            <a href="#">English</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="header__top__right__auth">
                                    {user ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyItems: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Link to={PATHS.PROFILE || "#"}>
                                                <i className="fa fa-user"></i>{" "}
                                                {user.username}
                                            </Link>
                                            <button
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await logout();
                                                }}
                                                className="ml-3 btn btn-link"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <Link to={PATHS.LOGIN}>
                                            <i className="fa fa-user"></i> Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Main */}
            <div className="container">
                <div className="row">
                    {/* Logo */}
                    <div className="col-lg-3">
                        <div className="header__logo">
                            <NavLink to="./index.html">
                                <img src="img/logo.png" alt="" />
                            </NavLink>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="col-lg-6">
                        <nav className="header__menu">
                            <ul>
                                <li className="">
                                    <NavLink to="/" end>
                                        Trang chủ
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/shop">Sản phẩm</NavLink>
                                </li>
                                {/* <li>
                                    <a href="#">Pages</a>
                                    <ul className="header__menu__dropdown">
                                        <li>
                                            <NavLink to="/shop-details">
                                                Shop Details
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/cart">
                                                Shoping Cart
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/checkout">
                                                Check Out
                                            </NavLink>
                                        </li>
                                        <li>
                                            <a href="#">Blog Details</a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <NavLink to="/blog">Blog</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/contact">Contact</NavLink>
                                </li> */}
                            </ul>
                        </nav>
                    </div>

                    {/* Cart */}
                    <div className="col-lg-3">
                        <div className="header__cart">
                            <ul>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-heart"></i>{" "}
                                        <span>1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-shopping-bag"></i>{" "}
                                        <span>3</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="header__cart__price">
                                item: <span>$150.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hamburger Trigger */}
                <div className="humberger__open">
                    <i className="fa fa-bars"></i>
                </div>
            </div>
        </header>
    );
};

export default Header;
