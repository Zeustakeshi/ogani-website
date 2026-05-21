import Breadcrumb from "@/components/ui/Breadcrumb";
import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/router/paths";

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
    const breadcrumbItems = [
        { label: "Home", path: PATHS.HOME },
        { label: "Register" },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <section className="auth-page spad">
                <div className="container">
                    <div className="auth-page__shell">
                        <div className="row g-0 align-items-stretch">
                            <div className="col-lg-5">
                                <div className="auth-page__brand h-100">
                                    <div>
                                        <h3>
                                            Tạo tài khoản mới để bắt đầu mua
                                            sắm.
                                        </h3>
                                        <p>
                                            Đăng ký nhanh để lưu địa chỉ, theo
                                            dõi đơn hàng và nhận ưu đãi dành
                                            riêng cho thành viên.
                                        </p>
                                    </div>

                                    <ul className="auth-page__benefits">
                                        <li>
                                            Chia sẻ giỏ hàng và danh sách yêu
                                            thích
                                        </li>
                                        <li>
                                            Thanh toán nhanh hơn cho lần mua sau
                                        </li>
                                        <li>
                                            Cập nhật khuyến mãi và trạng thái
                                            đơn hàng
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <div className="auth-page__form h-100">
                                    <span className="auth-page__eyebrow">
                                        Tạo tài khoản
                                    </span>
                                    <h2 className="auth-page__title">
                                        Đăng ký tài khoản
                                    </h2>
                                    <p className="auth-page__text">
                                        Vui lòng nhập thông tin bên dưới để tạo
                                        tài khoản mới.
                                    </p>

                                    <form
                                        onSubmit={(event) =>
                                            event.preventDefault()
                                        }
                                    >
                                        <div className="auth-page__field">
                                            <label htmlFor="register-username">
                                                Tên người dùng
                                            </label>
                                            <input
                                                id="register-username"
                                                name="username"
                                                type="text"
                                                placeholder="Nhập tên người dùng"
                                            />
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="register-email">
                                                Email
                                            </label>
                                            <input
                                                id="register-email"
                                                name="email"
                                                type="email"
                                                placeholder="Nhập địa chỉ email"
                                            />
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="register-phone">
                                                Số điện thoại
                                            </label>
                                            <input
                                                id="register-phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="register-password">
                                                Mật khẩu
                                            </label>
                                            <input
                                                id="register-password"
                                                name="password"
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                            />
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="register-password-confirm">
                                                Nhập lại mật khẩu
                                            </label>
                                            <input
                                                id="register-password-confirm"
                                                name="passwordConfirmation"
                                                type="password"
                                                placeholder="Nhập lại mật khẩu"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="site-btn auth-page__submit"
                                        >
                                            Tạo tài khoản
                                        </button>
                                    </form>

                                    <div className="auth-page__switch">
                                        Đã có tài khoản?{" "}
                                        <Link to={PATHS.LOGIN}>Đăng nhập</Link>
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

export default RegisterPage;
