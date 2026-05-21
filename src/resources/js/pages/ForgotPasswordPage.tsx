import Breadcrumb from "@/components/ui/Breadcrumb";
import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/router/paths";

interface ForgotPasswordPageProps {}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = () => {
    const breadcrumbItems = [
        { label: "Home", path: PATHS.HOME },
        { label: "Forgot Password" },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <section className="auth-page spad">
                <div className="container">
                    <div className="auth-page__shell auth-page__shell--compact">
                        <div className="auth-page__form">
                            <span className="auth-page__eyebrow">
                                Quên mật khẩu
                            </span>
                            <h2 className="auth-page__title">
                                Khôi phục mật khẩu
                            </h2>
                            <p className="auth-page__text">
                                Trang đặt lại mật khẩu đã sẵn sàng trong giao
                                diện. Bạn có thể bổ sung logic gửi email sau.
                            </p>

                            <Link
                                to={PATHS.LOGIN}
                                className="site-btn auth-page__submit"
                            >
                                Quay lại trang đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ForgotPasswordPage;
