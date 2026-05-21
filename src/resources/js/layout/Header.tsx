import React from "react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <div className="header-component">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="header__logo">
                            <a href="./index.html">
                                <h2>Ogani | Template</h2>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <nav className="header__menu">
                            <ul>
                                <li>
                                    <a href="./index.html">Home</a>
                                </li>
                                <li>
                                    <a href="./shop-grid.html">Shop</a>
                                </li>
                                <li className="dropdown">
                                    <a href="#">Pages</a>
                                    <ul className="dropdown-menu">
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
                                            <a href="./checkout.html">
                                                Check Out
                                            </a>
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
                    <div className="col-lg-3">
                        <div className="header__cart">
                            <a href="#">
                                <span className="icon_bag_alt"></span>
                                <sup>1</sup>
                            </a>
                            <span>3 item: $150.00</span>
                        </div>
                    </div>
                </div>
                <div className="humberger__open">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="header__categories">
                            <span className="icon_category"></span>
                            All departments
                            <ul className="categories__dropdown">
                                <li>
                                    <a href="#">Fresh Meat</a>
                                </li>
                                <li>
                                    <a href="#">Vegetables</a>
                                </li>
                                <li>
                                    <a href="#">Fruit & Nut Gifts</a>
                                </li>
                                <li>
                                    <a href="#">Fresh Berries</a>
                                </li>
                                <li>
                                    <a href="#">Ocean Foods</a>
                                </li>
                                <li>
                                    <a href="#">Butter & Eggs</a>
                                </li>
                                <li>
                                    <a href="#">Fastfood</a>
                                </li>
                                <li>
                                    <a href="#">Fresh Onion</a>
                                </li>
                                <li>
                                    <a href="#">Papayaya & Crisps</a>
                                </li>
                                <li>
                                    <a href="#">Oatmeal</a>
                                </li>
                                <li>
                                    <a href="#">Fresh Bananas</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="header__search">
                            <form action="#">
                                <input
                                    type="text"
                                    placeholder="All Categories"
                                />
                                <input type="text" placeholder="SEARCH" />
                                <button type="submit">
                                    <span className="icon_search"></span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="header__contact__info">
                            <div className="header__contact__phone">
                                <span className="icon_phone"></span>
                                <div>
                                    <span>+65 11.188.888</span>
                                    <p>support 24/7 time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
