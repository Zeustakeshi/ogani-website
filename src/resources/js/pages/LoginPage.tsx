import Breadcrumb from "@/components/ui/Breadcrumb";
import authService from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/router/paths";
import "./auth/Register.css";

interface LoginPageProps {}

type LoginFormData = {
    email: string;
    password: string;
    remember: boolean;
};

const initialFormData: LoginFormData = {
    email: "",
    password: "",
    remember: true,
};

const LoginPage: React.FC<LoginPageProps> = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [formData, setFormData] = useState<LoginFormData>(initialFormData);
    const [errors, setErrors] = useState<
        Partial<Record<keyof LoginFormData, string>>
    >({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbItems = [
        { label: "Home", path: PATHS.HOME },
        { label: "Login" },
    ];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, type, checked, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");
        setErrors({});

        try {
            const response = await authService.login(formData);
            const token = response?.data?.token;
            const user = response?.data?.user;

            if (user) {
                setAuth(user);
            }

            navigate(PATHS.HOME, { replace: true });
        } catch (error: any) {
            if (error?.response?.status === 422) {
                const serverErrors = error?.response?.data?.errors ?? {};

                setErrors({
                    email: serverErrors.email?.[0],
                    password: serverErrors.password?.[0],
                    remember: serverErrors.remember?.[0],
                });
            } else {
                setSubmitError(
                    error?.response?.data?.message ||
                        "Login failed. Please try again.",
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                        <h3>Chào mừng bạn quay lại</h3>
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

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="auth-page__field">
                                            <label htmlFor="login-email">
                                                Email
                                            </label>
                                            <input
                                                id="login-email"
                                                className={`register-page__input ${
                                                    errors.email
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="email"
                                                type="email"
                                                placeholder="Nhập địa chỉ email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email ? (
                                                <div className="register-page__field-error">
                                                    {errors.email}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="login-password">
                                                Mật khẩu
                                            </label>
                                            <input
                                                id="login-password"
                                                className={`register-page__input ${
                                                    errors.password
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="password"
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            {errors.password ? (
                                                <div className="register-page__field-error">
                                                    {errors.password}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="auth-page__row">
                                            <label className="auth-page__checkbox">
                                                <input
                                                    type="checkbox"
                                                    name="remember"
                                                    checked={formData.remember}
                                                    onChange={handleChange}
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

                                        {submitError ? (
                                            <div className="register-page__alert">
                                                {submitError}
                                            </div>
                                        ) : null}

                                        <button
                                            type="submit"
                                            className="site-btn auth-page__submit register-page__submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? "Đang xử lý..."
                                                : "Đăng nhập"}
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
