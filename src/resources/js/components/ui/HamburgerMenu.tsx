import React from "react";
import { Link, NavLink } from "react-router-dom";
import { PATHS } from "@/router/paths";
import CartIcon from "@/components/ui/CartIcon";

interface HamburgerMenuProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
    return (
        <>
            <div className="humberger__menu__overlay"></div>
            <div className="humberger__menu__wrapper">
                <div className="humberger__menu__logo">
                    <a href="#">
                        <img src="img/logo.png" alt="" />
                    </a>
                </div>
                <CartIcon className="humberger__menu__cart" />
                <div className="humberger__menu__widget">
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
                        <Link to={PATHS.LOGIN} onClick={onClose}>
                            <i className="fa fa-user"></i> Login
                        </Link>
                    </div>
                </div>
                <nav className="humberger__menu__nav mobile-menu">
                    <ul>
                        <li className="active">
                            <NavLink to="/" onClick={onClose}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/shop" onClick={onClose}>
                                Shop
                            </NavLink>
                        </li>
                        <li>
                            <a href="#">Pages</a>
                            <ul className="header__menu__dropdown">
                                <li>
                                    <NavLink
                                        to="/shop-details"
                                        onClick={onClose}
                                    >
                                        Shop Details
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/cart" onClick={onClose}>
                                        Shoping Cart
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/checkout" onClick={onClose}>
                                        Check Out
                                    </NavLink>
                                </li>
                                <li>
                                    <a href="#">Blog Details</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="/blog" onClick={onClose}>
                                Blog
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" onClick={onClose}>
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div id="mobile-menu-wrap"></div>
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
                <div className="humberger__menu__contact">
                    <ul>
                        <li>
                            <i className="fa fa-envelope"></i>{" "}
                            hello@colorlib.com
                        </li>
                        <li>Free Shipping for all Order of $99</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default HamburgerMenu;
