import authService from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/router/paths";

type AdminLoginFormData = {
    email: string;
    password: string;
};

const initialFormData: AdminLoginFormData = {
    email: "",
    password: "",
};

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const { user, setAuth } = useAuth();
    const [formData, setFormData] =
        useState<AdminLoginFormData>(initialFormData);
    const [errors, setErrors] = useState<
        Partial<Record<keyof AdminLoginFormData, string>>
    >({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }

        if (user.role === "admin") {
            navigate(PATHS.ADMIN, { replace: true });
            return;
        }

        navigate(PATHS.HOME, { replace: true });
    }, [navigate, user]);

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
            const response = await authService.login({
                email: formData.email,
                password: formData.password,
            });

            const loggedInUser = response?.data?.user;
            const token = response?.data?.token;

            if (!loggedInUser || loggedInUser.role !== "admin") {
                setSubmitError("Tài khoản này không có quyền admin.");
                return;
            }

            setAuth(loggedInUser as any, token);
            navigate(PATHS.ADMIN, { replace: true });
        } catch (error: any) {
            if (error?.response?.status === 422) {
                const serverErrors = error?.response?.data?.errors ?? {};

                setErrors({
                    email: serverErrors.email?.[0],
                    password: serverErrors.password?.[0],
                });
            } else {
                setSubmitError(
                    error?.response?.data?.message ||
                        "Đăng nhập admin thất bại. Vui lòng thử lại.",
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="admin-auth-page">
            <div className="admin-auth-page__panel admin-auth-page__panel--visual">
                <span className="admin-auth-page__eyebrow">Admin Portal</span>
                <h1>Đăng nhập Admin Portal</h1>
                <p>
                    Nhập username admin hoặc email admin cùng mật khẩu để truy
                    cập khu quản trị.
                </p>
            </div>

            <div className="admin-auth-page__panel admin-auth-page__panel--form">
                <div className="admin-auth-page__card">
                    <h2>Đăng nhập Admin</h2>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="admin-auth-page__field">
                            <label htmlFor="admin-email">
                                Tên tài khoản hoặc email
                            </label>
                            <input
                                id="admin-email"
                                name="email"
                                type="text"
                                placeholder="Nhập username admin hoặc email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "is-invalid" : ""}
                            />
                            {errors.email ? (
                                <div className="admin-auth-page__error">
                                    {errors.email}
                                </div>
                            ) : null}
                        </div>

                        <div className="admin-auth-page__field">
                            <label htmlFor="admin-password">Mật khẩu</label>
                            <input
                                id="admin-password"
                                name="password"
                                type="password"
                                placeholder="Nhập mật khẩu admin"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? "is-invalid" : ""}
                            />
                            {errors.password ? (
                                <div className="admin-auth-page__error">
                                    {errors.password}
                                </div>
                            ) : null}
                        </div>

                        {submitError ? (
                            <div className="admin-auth-page__alert">
                                {submitError}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            className="admin-auth-page__submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Đang xác thực..."
                                : "Vào trang quản trị"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
