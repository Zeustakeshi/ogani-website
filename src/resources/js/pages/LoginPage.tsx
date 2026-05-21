import Breadcrumb from "@/components/ui/Breadcrumb";
import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/router/paths";

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
    return (
        <>
            <section className="auth-page spad">
                <div className="container">
                    <div className="auth-page__shell">
                        <div className="row g-0 align-items-stretch">
                            <div className="col-lg-5">
                                <div className="auth-page__brand h-100">
                                    <div>
                                        <h3 style={{ textAlign: "center" }}>
                                            Chào mừng bạn quay lại
                                        </h3>
                                        <p>
                                            Đăng nhập để xem đơn hàng, lưu sản
                                            phẩm yêu thích và tiếp tục mua sắm
                                            nhanh hơn.
                                        </p>
                                    </div>

                                    <ul className="auth-page__benefits">
                                        <li>Quản lý đơn hàng dễ dàng</li>
                                        <li>
                                            Lưu địa chỉ và thông tin thanh toán
                                        </li>
                                        <li>
                                            Nhận ưu đãi dành riêng cho tài khoản
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <div className="auth-page__form h-100">
                                    <span className="auth-page__eyebrow">
                                        Đăng nhập
                                    </span>
                                    <h2 className="auth-page__title">
                                        Đăng nhập tài khoản
                                    </h2>
                                    <p className="auth-page__text">
                                        Nhập email và mật khẩu để tiếp tục vào
                                        tài khoản của bạn.
                                    </p>

                                    <form
                                        onSubmit={(event) =>
                                            event.preventDefault()
                                        }
                                    >
                                        <div className="auth-page__field">
                                            <label htmlFor="login-email">
                                                Email
                                            </label>
                                            <input
                                                id="login-email"
                                                name="email"
                                                type="email"
                                                placeholder="Nhập địa chỉ email"
                                            />
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="login-password">
                                                Mật khẩu
                                            </label>
                                            <input
                                                id="login-password"
                                                name="password"
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                            />
                                        </div>

                                        <div className="auth-page__row">
                                            <label className="auth-page__checkbox">
                                                <input
                                                    type="checkbox"
                                                    name="remember"
                                                />
                                                Ghi nhớ đăng nhập
                                            </label>

                                            <Link
                                                to={PATHS.FORGOT_PASSWORD}
                                                className="auth-page__forgot"
                                            >
                                                Quên mật khẩu?
                                            </Link>
                                        </div>

                                        <button
                                            type="submit"
                                            className="site-btn auth-page__submit"
                                        >
                                            Đăng nhập
                                        </button>
                                    </form>

                                    <div className="auth-page__switch">
                                        Chưa có tài khoản?{" "}
                                        <Link to={PATHS.REGISTER}>
                                            Tạo tài khoản ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginPage;
