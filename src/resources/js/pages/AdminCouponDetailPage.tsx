import { PATHS } from "@/router/paths";
import api from "@/services/api";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type AdminCoupon = {
    id: number;
    code: string;
    name: string;
    description: string;
    discount_percent: number;
    expire_at: string;
};

type CouponDetailResponse = {
    data?: AdminCoupon;
} & AdminCoupon;

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

export default function AdminCouponDetailPage() {
    const { id } = useParams();
    const [coupon, setCoupon] = useState<AdminCoupon | null>(null);
    const [formState, setFormState] = useState<CouponFormState>(
        createEmptyFormState(),
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoadError("Không tìm thấy coupon cần chỉnh sửa.");
            setIsLoading(false);
            return;
        }

        let isActive = true;

        (async () => {
            setIsLoading(true);
            setLoadError(null);
            setSaveError(null);
            setSaveSuccess(null);

            try {
                const response = await api.get<CouponDetailResponse>(
                    `/coupons/${id}`,
                );

                const payload = response.data?.data ?? response.data;

                if (!isActive) {
                    return;
                }

                if (!payload?.id) {
                    setCoupon(null);
                    setLoadError("Không thể tải thông tin coupon.");
                    return;
                }

                setCoupon(payload);
                setFormState({
                    code: payload.code ?? "",
                    name: payload.name ?? "",
                    description: payload.description ?? "",
                    discountPercent: String(payload.discount_percent ?? ""),
                    expireAt: toDateInputValue(payload.expire_at),
                });
            } catch {
                if (isActive) {
                    setCoupon(null);
                    setLoadError(
                        "Không thể tải thông tin coupon. Vui lòng thử lại.",
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [id]);

    const hasChanges =
        Boolean(coupon) &&
        (formState.code.trim() !== (coupon?.code ?? "").trim() ||
            formState.name.trim() !== (coupon?.name ?? "").trim() ||
            formState.description.trim() !==
                (coupon?.description ?? "").trim() ||
            formState.discountPercent.trim() !==
                String(coupon?.discount_percent ?? "") ||
            formState.expireAt.trim() !== toDateInputValue(coupon?.expire_at));

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!id || !hasChanges) {
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            const response = await api.patch<CouponDetailResponse>(
                `/coupons/${id}`,
                {
                    code: formState.code.trim(),
                    name: formState.name.trim(),
                    description: formState.description.trim(),
                    discount_percent: Number(formState.discountPercent),
                    expire_at: formState.expireAt,
                },
                { suppressUnauthorizedRedirect: true } as any,
            );

            const updatedCoupon = response.data?.data ?? response.data;

            if (updatedCoupon?.id) {
                setCoupon(updatedCoupon);
                setFormState({
                    code: updatedCoupon.code ?? "",
                    name: updatedCoupon.name ?? "",
                    description: updatedCoupon.description ?? "",
                    discountPercent: String(
                        updatedCoupon.discount_percent ?? "",
                    ),
                    expireAt: toDateInputValue(updatedCoupon.expire_at),
                });
            }

            setSaveSuccess("Đã cập nhật thông tin coupon.");
        } catch (error: any) {
            setSaveError(
                error?.response?.status === 401
                    ? "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập admin lại."
                    : error?.response?.data?.message ||
                          "Không thể cập nhật coupon. Vui lòng thử lại.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">
                        Chỉnh sửa khuyến mãi
                    </span>
                    <h1>Chi tiết coupon</h1>
                    <p>
                        Cập nhật thông tin coupon và kiểm tra lại ngày hết hạn
                        ngay trong một màn hình.
                    </p>
                </div>
                <div>
                    <Link
                        className="admin-page__view-link"
                        to={PATHS.ADMIN_COUPONS}
                    >
                        Quay lại danh sách
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="admin-page__table-card" style={{ padding: 24 }}>
                    <p>Đang tải thông tin coupon...</p>
                </div>
            ) : loadError ? (
                <div className="admin-page__table-card" style={{ padding: 24 }}>
                    <p>{loadError}</p>
                </div>
            ) : coupon ? (
                <div className="admin-page__coupon-grid">
                    <div className="admin-page__coupon-panel">
                        <div>
                            <h2>Thông tin hiện tại</h2>
                            <p>
                                Mã coupon: {coupon.code} - Giảm{" "}
                                {coupon.discount_percent}%
                            </p>
                            <p>Hết hạn: {formatDateTime(coupon.expire_at)}</p>
                        </div>

                        <form onSubmit={handleSave} noValidate>
                            <div className="admin-page__form-grid">
                                <div className="admin-auth-page__field">
                                    <label htmlFor="coupon-detail-code">
                                        Code
                                    </label>
                                    <input
                                        id="coupon-detail-code"
                                        type="text"
                                        value={formState.code}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                code: event.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="admin-auth-page__field">
                                    <label htmlFor="coupon-detail-name">
                                        Tên coupon
                                    </label>
                                    <input
                                        id="coupon-detail-name"
                                        type="text"
                                        value={formState.name}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                name: event.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="admin-auth-page__field admin-page__form-grid--full">
                                    <label htmlFor="coupon-detail-description">
                                        Mô tả
                                    </label>
                                    <textarea
                                        id="coupon-detail-description"
                                        value={formState.description}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                description: event.target.value,
                                            }))
                                        }
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
                                    <label htmlFor="coupon-detail-discount-percent">
                                        Giảm giá (%)
                                    </label>
                                    <input
                                        id="coupon-detail-discount-percent"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={formState.discountPercent}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                discountPercent:
                                                    event.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="admin-auth-page__field">
                                    <label htmlFor="coupon-detail-expire-at">
                                        Hết hạn
                                    </label>
                                    <input
                                        id="coupon-detail-expire-at"
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
                                disabled={isSaving || !hasChanges}
                                style={{ borderRadius: 0 }}
                            >
                                {isSaving
                                    ? "Đang cập nhật..."
                                    : "Cập nhật coupon"}
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
                            <article className="admin-page__table-row">
                                <strong>{coupon.code}</strong>
                                <span>{coupon.name}</span>
                                <span>{coupon.discount_percent}%</span>
                                <span>{formatDateTime(coupon.expire_at)}</span>
                                <span>{coupon.description}</span>
                                <span>
                                    <Link
                                        className="admin-page__action-link"
                                        to={PATHS.ADMIN_COUPONS}
                                    >
                                        Danh sách
                                    </Link>
                                </span>
                            </article>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
