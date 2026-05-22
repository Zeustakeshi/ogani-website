import { PATHS } from "@/router/paths";
import api from "@/services/api";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type AdminCoupon = {
    id: number;
    code: string;
    name: string;
    description: string;
    discount_percent: number;
    expire_at: string;
};

type CouponListResponse = {
    data?: AdminCoupon[];
};

type CouponFormState = {
    code: string;
    name: string;
    description: string;
    discountPercent: string;
    expireAt: string;
};

const createEmptyFormState = (): CouponFormState => ({
    code: "",
    name: "",
    description: "",
    discountPercent: "",
    expireAt: "",
});

const toDateInputValue = (value?: string | null) => {
    if (!value) {
        return "";
    }

    return String(value).split("T")[0].split(" ")[0];
};

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
    const [formState, setFormState] = useState<CouponFormState>(
        createEmptyFormState(),
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    const discountFormatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    const loadCoupons = async (guard?: () => boolean) => {
        setIsLoading(true);
        setLoadError(null);

        try {
            const response = await api.get<CouponListResponse>("/coupons", {
                params: {
                    per_page: 1000,
                },
            });

            if (guard && !guard()) {
                return;
            }

            setCoupons(response.data?.data ?? []);
        } catch {
            if (!guard || guard()) {
                setCoupons([]);
                setLoadError("Không thể tải danh sách khuyến mãi.");
            }
        } finally {
            if (!guard || guard()) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        let isActive = true;

        void loadCoupons(() => isActive);

        return () => {
            isActive = false;
        };
    }, []);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            await api.post(
                "/coupons",
                {
                    code: formState.code.trim(),
                    name: formState.name.trim(),
                    description: formState.description.trim(),
                    discount_percent: Number(formState.discountPercent),
                    expire_at: formState.expireAt,
                },
                { suppressUnauthorizedRedirect: true } as any,
            );

            setFormState(createEmptyFormState());
            setSaveSuccess("Đã tạo coupon mới thành công.");
            await loadCoupons();
        } catch (error: any) {
            setSaveError(
                error?.response?.data?.message ||
                    "Không thể tạo coupon. Vui lòng thử lại.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (coupon: AdminCoupon) => {
        const isConfirmed = window.confirm(
            `Bạn có chắc muốn xóa coupon ${coupon.code}?`,
        );

        if (!isConfirmed) {
            return;
        }

        setSaveError(null);
        setSaveSuccess(null);

        try {
            await api.delete(`/coupons/${coupon.id}`, {
                suppressUnauthorizedRedirect: true,
            } as any);

            setCoupons((current) =>
                current.filter((item) => item.id !== coupon.id),
            );
            setSaveSuccess(`Đã xóa coupon ${coupon.code}.`);
        } catch (error: any) {
            setSaveError(
                error?.response?.data?.message ||
                    "Không thể xóa coupon. Vui lòng thử lại.",
            );
        }
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">
                        Quản lý khuyến mãi
                    </span>
                    <h1>Coupon</h1>
                    <p>
                        Tạo mới coupon và xem toàn bộ danh sách khuyến mãi đang
                        có trong hệ thống.
                    </p>
                </div>
            </div>

            <div className="admin-page__coupon-grid">
                <div className="admin-page__coupon-panel">
                    <div>
                        <h2>Tạo coupon mới</h2>
                        <p>
                            Nhập thông tin khuyến mãi để tạo coupon cho admin.
                        </p>
                    </div>

                    <form onSubmit={handleCreate} noValidate>
                        <div className="admin-page__form-grid">
                            <div className="admin-auth-page__field">
                                <label htmlFor="coupon-code">Code</label>
                                <input
                                    id="coupon-code"
                                    type="text"
                                    value={formState.code}
                                    onChange={(event) =>
                                        setFormState((current) => ({
                                            ...current,
                                            code: event.target.value,
                                        }))
                                    }
                                    placeholder="VD: SUMMER2026"
                                />
                            </div>

                            <div className="admin-auth-page__field">
                                <label htmlFor="coupon-name">Tên coupon</label>
                                <input
                                    id="coupon-name"
                                    type="text"
                                    value={formState.name}
                                    onChange={(event) =>
                                        setFormState((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder="Nhập tên khuyến mãi"
                                />
                            </div>

                            <div className="admin-auth-page__field admin-page__form-grid--full">
                                <label htmlFor="coupon-description">
                                    Mô tả
                                </label>
                                <textarea
                                    id="coupon-description"
                                    value={formState.description}
                                    onChange={(event) =>
                                        setFormState((current) => ({
                                            ...current,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Nhập mô tả khuyến mãi"
                                    rows={5}
                                    style={{
                                        width: "100%",
                                        border: "1px solid #dfe7d2",
                                        borderRadius: 0,
                                        padding: 18,
                                        fontSize: 15,
                                        color: "#1c1c1c",
                                        resize: "vertical",
                                    }}
                                />
                            </div>

                            <div className="admin-auth-page__field">
                                <label htmlFor="coupon-discount-percent">
                                    Giảm giá (%)
                                </label>
                                <input
                                    id="coupon-discount-percent"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={formState.discountPercent}
                                    onChange={(event) =>
                                        setFormState((current) => ({
                                            ...current,
                                            discountPercent: event.target.value,
                                        }))
                                    }
                                    placeholder="VD: 20"
                                />
                            </div>

                            <div className="admin-auth-page__field">
                                <label htmlFor="coupon-expire-at">
                                    Hết hạn
                                </label>
                                <input
                                    id="coupon-expire-at"
                                    type="date"
                                    value={formState.expireAt}
                                    onChange={(event) =>
                                        setFormState((current) => ({
                                            ...current,
                                            expireAt: event.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        {saveError ? (
                            <div className="admin-auth-page__alert">
                                {saveError}
                            </div>
                        ) : null}

                        {saveSuccess ? (
                            <div
                                className="admin-auth-page__alert"
                                style={{
                                    background: "rgba(127, 173, 57, 0.10)",
                                    color: "#4f7d1f",
                                    border: "1px solid rgba(127, 173, 57, 0.22)",
                                }}
                            >
                                {saveSuccess}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            className="admin-auth-page__submit"
                            disabled={isSaving}
                            style={{ borderRadius: 0 }}
                        >
                            {isSaving ? "Đang tạo..." : "Tạo coupon"}
                        </button>
                    </form>
                </div>

                <div className="admin-page__table-card admin-page__table-card--coupons">
                    <div className="admin-page__table-head">
                        <span>Code</span>
                        <span>Tên coupon</span>
                        <span>Giảm giá</span>
                        <span>Hết hạn</span>
                        <span>Mô tả</span>
                        <span>Hành động</span>
                    </div>

                    <div className="admin-page__table-body">
                        {isLoading ? (
                            <article className="admin-page__table-row">
                                <span>Đang tải khuyến mãi...</span>
                            </article>
                        ) : loadError ? (
                            <article className="admin-page__table-row">
                                <span>{loadError}</span>
                            </article>
                        ) : coupons.length === 0 ? (
                            <div className="admin-page__empty-state">
                                Chưa có coupon nào trong hệ thống.
                            </div>
                        ) : (
                            coupons.map((coupon) => (
                                <article
                                    key={coupon.id}
                                    className="admin-page__table-row"
                                >
                                    <strong>{coupon.code}</strong>
                                    <span>{coupon.name}</span>
                                    <span>
                                        {discountFormatter.format(
                                            coupon.discount_percent,
                                        )}
                                        %
                                    </span>
                                    <span>
                                        {formatDateTime(coupon.expire_at)}
                                    </span>
                                    <span className="admin-page__table-cell-wrap">
                                        <span>{coupon.description}</span>
                                    </span>
                                    <span
                                        style={{
                                            display: "flex",
                                        }}
                                    >
                                        <Link
                                            to={PATHS.ADMIN_COUPON_DETAIL.replace(
                                                ":id",
                                                String(coupon.id),
                                            )}
                                            className="admin-page__action-link"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            type="button"
                                            className="admin-page__danger-link"
                                            onClick={() => handleDelete(coupon)}
                                        >
                                            Xóa
                                        </button>
                                    </span>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
