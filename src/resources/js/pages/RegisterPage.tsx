import Breadcrumb from "@/components/ui/Breadcrumb";
import authService from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/router/paths";
import "./auth/Register.css";

type RegisterFormData = {
    username: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
};

type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;

const initialFormData: RegisterFormData = {
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbItems = [
        { label: "Home", path: PATHS.HOME },
        { label: "Register" },
    ];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
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
            const response = await authService.register(formData);
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
                    username: serverErrors.username?.[0],
                    email: serverErrors.email?.[0],
                    phone: serverErrors.phone?.[0],
                    password: serverErrors.password?.[0],
                    password_confirmation:
                        serverErrors.password_confirmation?.[0],
                });
            } else {
                setSubmitError(
                    error?.response?.data?.message ||
                        "Registration failed. Please try again.",
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

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="auth-page__field">
                                            <label htmlFor="register-username">
                                                Tên người dùng
                                            </label>
                                            <input
                                                id="register-username"
                                                className={`register-page__input ${
                                                    errors.username
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="username"
                                                type="text"
                                                placeholder="Nhập tên người dùng"
                                                value={formData.username}
                                                onChange={handleChange}
                                            />
                                            {errors.username ? (
                                                <div className="register-page__field-error">
                                                    {errors.username}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="register-email">
                                                Email
                                            </label>
                                            <input
                                                id="register-email"
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
                                            <label htmlFor="register-phone">
                                                Số điện thoại
                                            </label>
                                            <input
                                                id="register-phone"
                                                className={`register-page__input ${
                                                    errors.phone
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="phone"
                                                type="tel"
                                                placeholder="Nhập số điện thoại"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                            {errors.phone ? (
                                                <div className="register-page__field-error">
                                                    {errors.phone}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="auth-page__field">
                                            <label htmlFor="register-password">
                                                Mật khẩu
                                            </label>
                                            <input
                                                id="register-password"
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

                                        <div className="auth-page__field">
                                            <label htmlFor="register-password-confirm">
                                                Nhập lại mật khẩu
                                            </label>
                                            <input
                                                id="register-password-confirm"
                                                className={`register-page__input ${
                                                    errors.password_confirmation
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="password_confirmation"
                                                type="password"
                                                placeholder="Nhập lại mật khẩu"
                                                value={
                                                    formData.password_confirmation
                                                }
                                                onChange={handleChange}
                                            />
                                            {errors.password_confirmation ? (
                                                <div className="register-page__field-error">
                                                    {
                                                        errors.password_confirmation
                                                    }
                                                </div>
                                            ) : null}
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
                                                : "Tạo tài khoản"}
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
}
