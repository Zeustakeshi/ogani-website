import api from "@/services/api";
import React, { useEffect, useState } from "react";

type AdminOrderUser = {
    id: number;
    username?: string | null;
    email?: string | null;
};

type AdminOrder = {
    id: number;
    momo_order_id?: string | null;
    status: string;
    status_label?: string;
    total: number;
    created_at?: string | null;
    paid_at?: string | null;
    user?: AdminOrderUser | null;
};

type AdminOrderListResponse = {
    data?: AdminOrder[];
};

const statusStyles: Record<
    string,
    { label: string; background: string; color: string }
> = {
    pending: {
        label: "Chờ thanh toán",
        background: "rgba(214, 158, 46, 0.12)",
        color: "#a66a00",
    },
    paid: {
        label: "Đã thanh toán",
        background: "rgba(46, 134, 171, 0.12)",
        color: "#256b8a",
    },
    shipping: {
        label: "Đang giao hàng",
        background: "rgba(127, 173, 57, 0.12)",
        color: "#4f7d1f",
    },
    success: {
        label: "Thành công",
        background: "rgba(76, 175, 80, 0.12)",
        color: "#2e7d32",
    },
    cancel: {
        label: "Đã hủy",
        background: "rgba(229, 57, 53, 0.12)",
        color: "#b3261e",
    },
};

const formatCurrency = (value: number) =>
    `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)}đ`;

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        (async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await api.get<AdminOrderListResponse>(
                    "/admin/orders",
                    {
                        params: {
                            per_page: 50,
                        },
                    },
                );

                if (!isActive) {
                    return;
                }

                setOrders(response.data?.data ?? []);
            } catch {
                if (isActive) {
                    setOrders([]);
                    setErrorMessage("Không thể tải danh sách đơn hàng.");
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
    }, []);

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">
                        Quản lý đơn hàng
                    </span>
                    <h1>Đơn hàng</h1>
                    <p>
                        Theo dõi trạng thái đơn hàng và luồng xử lý hiện tại của
                        hệ thống.
                    </p>
                </div>
            </div>

            <div className="admin-page__table-card admin-page__table-card--orders">
                <div className="admin-page__table-head">
                    <span>Mã đơn</span>
                    <span>Khách hàng</span>
                    <span>Trạng thái</span>
                    <span>Tổng tiền</span>
                    <span>Ngày tạo</span>
                </div>

                <div className="admin-page__table-body">
                    {isLoading ? (
                        <article className="admin-page__table-row">
                            <span>Đang tải đơn hàng...</span>
                        </article>
                    ) : errorMessage ? (
                        <article className="admin-page__table-row">
                            <span>{errorMessage}</span>
                        </article>
                    ) : orders.length === 0 ? (
                        <article className="admin-page__table-row">
                            <span>Chưa có đơn hàng nào.</span>
                        </article>
                    ) : (
                        orders.map((order) => {
                            const status = statusStyles[order.status] ?? {
                                label: order.status_label ?? order.status,
                                background: "rgba(28, 28, 28, 0.08)",
                                color: "#1c1c1c",
                            };

                            const customerName =
                                order.user?.username ||
                                order.user?.email ||
                                "Khách hàng";

                            return (
                                <article
                                    key={order.id}
                                    className="admin-page__table-row"
                                >
                                    <strong>
                                        {order.momo_order_id ??
                                            `#OD-${order.id}`}
                                    </strong>
                                    <span>{customerName}</span>
                                    <span>
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                padding: "4px 10px",
                                                borderRadius: 0,
                                                background: status.background,
                                                color: status.color,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {status.label}
                                        </span>
                                    </span>
                                    <span>{formatCurrency(order.total)}</span>
                                    <span>
                                        {formatDateTime(order.created_at)}
                                    </span>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
