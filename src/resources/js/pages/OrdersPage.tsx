import Breadcrumb from "@/components/ui/Breadcrumb";
import api from "@/services/api";
import { PATHS } from "@/router/paths";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type OrderUser = {
    id: number;
    username?: string | null;
    email?: string | null;
};

type Order = {
    id: number;
    momo_order_id?: string | null;
    status: string;
    status_label?: string;
    total: number;
    created_at?: string | null;
    paid_at?: string | null;
    items_count?: number | null;
    user?: OrderUser | null;
};

type OrderListResponse = {
    data?: Order[];
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

const priceFormatter = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => `${priceFormatter.format(value)}đ`;

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Quản lý đơn hàng" },
    ];

    useEffect(() => {
        let isActive = true;

        (async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await api.get<OrderListResponse>("/orders", {
                    params: {
                        per_page: 50,
                    },
                });

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
        <>
            <Breadcrumb items={breadcrumbItems} />
            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div
                                className="checkout__order"
                                style={{ borderRadius: 0 }}
                            >
                                <h4>Quản lý đơn hàng</h4>
                                <p style={{ marginBottom: 24 }}>
                                    Theo dõi trạng thái xử lý và xem nhanh lịch
                                    sử những đơn bạn đã đặt.
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 16,
                                        alignItems: "center",
                                        marginBottom: 18,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <strong>
                                        {orders.length} đơn hàng được tìm thấy
                                    </strong>
                                    <span style={{ color: "#7a7a7a" }}>
                                        Trạng thái hiển thị theo cập nhật mới
                                        nhất từ hệ thống.
                                    </span>
                                </div>

                                <div style={{ overflowX: "auto" }}>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            border: "1px solid #e6e6e6",
                                            borderRadius: 0,
                                            minWidth: 780,
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th style={headerCellStyle}>
                                                    Mã đơn
                                                </th>
                                                <th style={headerCellStyle}>
                                                    Ngày tạo
                                                </th>
                                                <th style={headerCellStyle}>
                                                    Sản phẩm
                                                </th>
                                                <th style={headerCellStyle}>
                                                    Tổng tiền
                                                </th>
                                                <th style={headerCellStyle}>
                                                    Trạng thái
                                                </th>
                                                <th style={headerCellStyle}>
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        style={emptyCellStyle}
                                                    >
                                                        Đang tải đơn hàng...
                                                    </td>
                                                </tr>
                                            ) : errorMessage ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        style={emptyCellStyle}
                                                    >
                                                        {errorMessage}
                                                    </td>
                                                </tr>
                                            ) : orders.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        style={emptyCellStyle}
                                                    >
                                                        Bạn chưa có đơn hàng
                                                        nào.
                                                    </td>
                                                </tr>
                                            ) : (
                                                orders.map((order) => {
                                                    const status = statusStyles[
                                                        order.status
                                                    ] ?? {
                                                        label:
                                                            order.status_label ??
                                                            order.status,
                                                        background:
                                                            "rgba(28, 28, 28, 0.08)",
                                                        color: "#1c1c1c",
                                                    };

                                                    return (
                                                        <tr
                                                            key={order.id}
                                                            style={rowStyle}
                                                        >
                                                            <td
                                                                style={
                                                                    bodyCellStyle
                                                                }
                                                            >
                                                                <strong>
                                                                    {order.momo_order_id ??
                                                                        `#OD-${order.id}`}
                                                                </strong>
                                                            </td>
                                                            <td
                                                                style={
                                                                    bodyCellStyle
                                                                }
                                                            >
                                                                {formatDateTime(
                                                                    order.created_at,
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    bodyCellStyle
                                                                }
                                                            >
                                                                {order.items_count ??
                                                                    0}{" "}
                                                                sản phẩm
                                                            </td>
                                                            <td
                                                                style={
                                                                    bodyCellStyle
                                                                }
                                                            >
                                                                {formatCurrency(
                                                                    order.total,
                                                                )}
                                                            </td>
                                                            <td
                                                                style={
                                                                    bodyCellStyle
                                                                }
                                                            >
                                                                <span
                                                                    style={{
                                                                        display:
                                                                            "inline-flex",
                                                                        alignItems:
                                                                            "center",
                                                                        padding:
                                                                            "4px 10px",
                                                                        borderRadius: 0,
                                                                        background:
                                                                            status.background,
                                                                        color: status.color,
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td
                                                                style={
                                                                    bodyCellStyle
                                                                }
                                                            >
                                                                <Link
                                                                    to={PATHS.ORDER_DETAIL.replace(
                                                                        ":id",
                                                                        String(
                                                                            order.id,
                                                                        ),
                                                                    )}
                                                                    className="site-btn"
                                                                    style={{
                                                                        borderRadius: 0,
                                                                        padding:
                                                                            "8px 16px",
                                                                        display:
                                                                            "inline-flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                        textDecoration:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    Xem chi tiết
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const headerCellStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "14px 16px",
    borderBottom: "1px solid #e6e6e6",
    background: "#f7f7f2",
    fontWeight: 600,
};

const bodyCellStyle: React.CSSProperties = {
    padding: "16px",
    borderBottom: "1px solid #ededed",
    verticalAlign: "middle",
};

const rowStyle: React.CSSProperties = {
    background: "#fff",
};

const emptyCellStyle: React.CSSProperties = {
    padding: "24px 16px",
    textAlign: "center",
    color: "#666",
};

export default OrdersPage;
