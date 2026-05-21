import React from "react";

interface NavigationMenuProps {}

const NavigationMenu: React.FC<NavigationMenuProps> = (props) => {
    return (
        <div className="navigation-menu-component">
            <div className="container">
                <nav className="navigation__menu">
                    <ul>
                        <li className="active">
                            <a href="./index.html">Home</a>
                        </li>
                        <li>
                            <a href="./shop-grid.html">Shop</a>
                        </li>
                        <li className="dropdown">
                            <a href="#">Pages</a>
                            <ul className="dropdown__menu">
                                <li>
                                    <a href="./shop-details.html">
                                        Shop Details
                                    </a>
                                </li>
                                <li>
                                    <a href="./shoping-cart.html">
                                        Shoping Cart
                                    </a>
                                </li>
                                <li>
                                    <a href="./checkout.html">Check Out</a>
                                </li>
                                <li>
                                    <a href="./blog-details.html">
                                        Blog Details
                                    </a>
                                </li>
                                <li>
                                    <a href="./blog.html">Blog</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="./contact.html">Contact</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default NavigationMenu;
