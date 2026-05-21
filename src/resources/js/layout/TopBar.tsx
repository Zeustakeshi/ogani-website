import React from "react";

interface TopBarProps {}

const TopBar: React.FC<TopBarProps> = (props) => {
    return (
        <div className="topbar-component">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="topbar__left">
                            <div className="topbar__language">
                                <span>English</span>
                                <ul className="topbar__language__dropdown">
                                    <li>
                                        <a href="#">Spanis</a>
                                    </li>
                                    <li>
                                        <a href="#">English</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="topbar__login">
                                <a href="#">Login</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="topbar__right">
                            <div className="topbar__cart">
                                <a href="#">
                                    <span className="icon_bag_alt"></span>
                                    <sup>1</sup>
                                </a>
                                <span>3 item: $150.00</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="topbar__contact">
                            <span className="icon_mail_alt"></span>
                            hello@colorlib.com
                        </div>
                        <div className="topbar__shipping">
                            Free Shipping for all Order of $99
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="topbar__contact">
                            <span className="icon_mail_alt"></span>
                            hello@colorlib.com
                        </div>
                        <div className="topbar__shipping">
                            Free Shipping for all Order of $99
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="topbar__language">
                            <span>English</span>
                            <ul className="topbar__language__dropdown">
                                <li>
                                    <a href="#">Spanis</a>
                                </li>
                                <li>
                                    <a href="#">English</a>
                                </li>
                            </ul>
                        </div>
                        <div className="topbar__login">
                            <a href="#">Login</a>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="topbar__cart">
                            <a href="#">
                                <span className="icon_bag_alt"></span>
                                <sup>1</sup>
                            </a>
                            <span>3 item: $150.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
