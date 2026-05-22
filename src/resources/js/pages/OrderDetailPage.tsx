import Breadcrumb from "@/components/ui/Breadcrumb";
import api from "@/services/api";
import { PATHS } from "@/router/paths";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type OrderItemProduct = {
    id: number | string;
    name?: string | null;
    price?: number | null;
    images?: string[];
};

type OrderItem = {
    id: number;
    product_id: number | string;
    price: number;
    amount: number;
    subtotal: number;
    product?: OrderItemProduct | null;
};

type Order = {
    id: number;
    momo_order_id?: string | null;
    coupon_code?: string | null;
    status: string;
    status_label?: string;
    total: number;
    address?: string | null;
    note?: string | null;
    paid_at?: string | null;
    created_at?: string | null;
    items_count?: number | null;
    items?: OrderItem[];
};

type OrderDetailResponse = {
    data?: Order;
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

const fallbackImage = "/img/product/details/product-details-1.jpg";

type MapLocation = {
    lat: number;
    lon: number;
    displayName?: string;
};

const OrderDetailPage: React.FC = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [mapLocation, setMapLocation] = useState<MapLocation | null>(null);
    const [isMapLoading, setIsMapLoading] = useState(false);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Quản lý đơn hàng", path: PATHS.ORDERS },
        { label: "Chi tiết đơn hàng" },
    ];

    useEffect(() => {
        if (!id) {
            setErrorMessage("Không tìm thấy đơn hàng.");
            setIsLoading(false);
            return;
        }

        let isActive = true;

        (async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await api.get<OrderDetailResponse>(
                    `/orders/${id}`,
                );

                if (!isActive) {
                    return;
                }

                setOrder(response.data?.data ?? null);
            } catch {
                if (isActive) {
                    setOrder(null);
                    setErrorMessage("Không thể tải chi tiết đơn hàng.");
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

    useEffect(() => {
        if (!order?.address) {
            setMapLocation(null);
            setIsMapLoading(false);
            return;
        }

        let isActive = true;

        (async () => {
            setIsMapLoading(true);

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(order.address ?? "")}`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                    },
                );

                const data = (await response.json()) as Array<{
                    lat?: string;
                    lon?: string;
                    display_name?: string;
                }>;
                const firstResult = data?.[0];

                if (isActive && firstResult?.lat && firstResult?.lon) {
                    setMapLocation({
                        lat: Number(firstResult.lat),
                        lon: Number(firstResult.lon),
                        displayName:
                            firstResult.display_name ?? order.address ?? "",
                    });
                } else if (isActive) {
                    setMapLocation(null);
                }
            } catch {
                if (isActive) {
                    setMapLocation(null);
                }
            } finally {
                if (isActive) {
                    setIsMapLoading(false);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [order?.address]);

    const status = useMemo(() => {
        if (!order) {
            return null;
        }

        return (
            statusStyles[order.status] ?? {
                label: order.status_label ?? order.status,
                background: "rgba(28, 28, 28, 0.08)",
                color: "#1c1c1c",
            }
        );
    }, [order]);

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
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 16,
                                        flexWrap: "wrap",
                                        marginBottom: 20,
                                    }}
                                >
                                    <div>
                                        <h4 style={{ marginBottom: 8 }}>
                                            Chi tiết đơn hàng
                                        </h4>
                                        <p style={{ marginBottom: 0 }}>
                                            Thông tin đầy đủ về trạng thái, sản
                                            phẩm và thời gian xử lý.
                                        </p>
                                    </div>

                                    <Link
                                        to={PATHS.ORDERS}
                                        className="site-btn"
                                        style={{
                                            borderRadius: 0,
                                            padding: "8px 16px",
                                            textDecoration: "none",
                                        }}
                                    >
                                        Quay lại danh sách
                                    </Link>
                                </div>

                                {isLoading ? (
                                    <p>Đang tải chi tiết đơn hàng...</p>
                                ) : errorMessage ? (
                                    <p>{errorMessage}</p>
                                ) : !order ? (
                                    <p>Không tìm thấy đơn hàng.</p>
                                ) : (
                                    <>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(180px, 1fr))",
                                                gap: 16,
                                                marginBottom: 24,
                                            }}
                                        >
                                            <InfoCard
                                                label="Mã đơn"
                                                value={
                                                    order.momo_order_id ??
                                                    `#OD-${order.id}`
                                                }
                                            />
                                            <InfoCard
                                                label="Ngày tạo"
                                                value={formatDateTime(
                                                    order.created_at,
                                                )}
                                            />
                                            <InfoCard
                                                label="Ngày thanh toán"
                                                value={formatDateTime(
                                                    order.paid_at,
                                                )}
                                            />
                                            <InfoCard
                                                label="Trạng thái"
                                                value={status?.label ?? "-"}
                                                accent={status?.background}
                                                accentColor={status?.color}
                                            />
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(260px, 1fr))",
                                                gap: 16,
                                                marginBottom: 24,
                                            }}
                                        >
                                            <InfoCard
                                                label="Ghi chú"
                                                value={order.note ?? "Không có"}
                                                fullWidth
                                            />
                                        </div>

                                        <div
                                            style={{
                                                border: "1px solid #e6e6e6",
                                                borderRadius: 0,
                                                padding: 16,
                                                marginBottom: 24,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color: "#777",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                Địa chỉ giao hàng
                                            </div>
                                            <strong>
                                                {order.address ??
                                                    "Chưa có thông tin"}
                                            </strong>

                                            <div
                                                style={{
                                                    marginTop: 16,
                                                    border: "1px solid #e6e6e6",
                                                    borderRadius: 0,
                                                    overflow: "hidden",
                                                    background: "#f6f6f1",
                                                }}
                                            >
                                                {isMapLoading ? (
                                                    <div
                                                        style={{
                                                            minHeight: 320,
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            color: "#666",
                                                            padding: 24,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Đang tải bản đồ
                                                        OpenStreetMap...
                                                    </div>
                                                ) : mapLocation ? (
                                                    <iframe
                                                        title="Bản đồ giao hàng OpenStreetMap"
                                                        src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${mapLocation.lat}%2C${mapLocation.lon}`}
                                                        style={{
                                                            width: "100%",
                                                            height: 320,
                                                            border: 0,
                                                            display: "block",
                                                        }}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            minHeight: 320,
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            gap: 12,
                                                            color: "#666",
                                                            padding: 24,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <span>
                                                            Không thể xác định
                                                            tọa độ từ địa chỉ
                                                            này.
                                                        </span>
                                                        <a
                                                            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(order.address ?? "")}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{
                                                                color: "#7fad39",
                                                                textDecoration:
                                                                    "none",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Mở trên
                                                            OpenStreetMap
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: 10,
                                                    color: "#777",
                                                }}
                                            >
                                                {mapLocation?.displayName ??
                                                    "Kết quả bản đồ sẽ hiển thị theo địa chỉ đã lưu của đơn hàng."}
                                            </div>
                                        </div>

                                        <div style={{ overflowX: "auto" }}>
                                            <table
                                                style={{
                                                    width: "100%",
                                                    borderCollapse: "collapse",
                                                    border: "1px solid #e6e6e6",
                                                    minWidth: 820,
                                                }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th
                                                            style={
                                                                headerCellStyle
                                                            }
                                                        >
                                                            Sản phẩm
                                                        </th>
                                                        <th
                                                            style={
                                                                headerCellStyle
                                                            }
                                                        >
                                                            Đơn giá
                                                        </th>
                                                        <th
                                                            style={
                                                                headerCellStyle
                                                            }
                                                        >
                                                            Số lượng
                                                        </th>
                                                        <th
                                                            style={
                                                                headerCellStyle
                                                            }
                                                        >
                                                            Thành tiền
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(order.items ?? [])
                                                        .length === 0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                style={
                                                                    emptyCellStyle
                                                                }
                                                            >
                                                                Đơn hàng này
                                                                chưa có sản
                                                                phẩm.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        order.items?.map(
                                                            (item) => {
                                                                const product =
                                                                    item.product;
                                                                const image =
                                                                    product
                                                                        ?.images?.[0] ??
                                                                    fallbackImage;

                                                                return (
                                                                    <tr
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        style={
                                                                            rowStyle
                                                                        }
                                                                    >
                                                                        <td
                                                                            style={
                                                                                bodyCellStyle
                                                                            }
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    display:
                                                                                        "flex",
                                                                                    alignItems:
                                                                                        "center",
                                                                                    gap: 16,
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        image
                                                                                    }
                                                                                    alt={
                                                                                        product?.name ??
                                                                                        "Sản phẩm"
                                                                                    }
                                                                                    style={{
                                                                                        width: 72,
                                                                                        height: 72,
                                                                                        objectFit:
                                                                                            "cover",
                                                                                        borderRadius: 0,
                                                                                        flexShrink: 0,
                                                                                    }}
                                                                                />
                                                                                <div>
                                                                                    <strong>
                                                                                        {product?.name ??
                                                                                            "Sản phẩm"}
                                                                                    </strong>
                                                                                    <div
                                                                                        style={{
                                                                                            color: "#777",
                                                                                            marginTop: 4,
                                                                                        }}
                                                                                    >
                                                                                        Mã
                                                                                        sản
                                                                                        phẩm:{" "}
                                                                                        {
                                                                                            item.product_id
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td
                                                                            style={
                                                                                bodyCellStyle
                                                                            }
                                                                        >
                                                                            {formatCurrency(
                                                                                item.price,
                                                                            )}
                                                                        </td>
                                                                        <td
                                                                            style={
                                                                                bodyCellStyle
                                                                            }
                                                                        >
                                                                            {
                                                                                item.amount
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            style={
                                                                                bodyCellStyle
                                                                            }
                                                                        >
                                                                            {formatCurrency(
                                                                                item.subtotal,
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            },
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                marginTop: 24,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    minWidth: 320,
                                                    border: "1px solid #e6e6e6",
                                                    borderRadius: 0,
                                                    padding: 20,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        marginBottom: 12,
                                                    }}
                                                >
                                                    <span>Tổng tiền</span>
                                                    <strong>
                                                        {formatCurrency(
                                                            order.total,
                                                        )}
                                                    </strong>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        marginBottom: 12,
                                                    }}
                                                >
                                                    <span>Số sản phẩm</span>
                                                    <strong>
                                                        {order.items?.length ??
                                                            0}
                                                    </strong>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <span>Trạng thái</span>
                                                    <strong>
                                                        {status?.label ?? "-"}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

function InfoCard({
    label,
    value,
    accent,
    accentColor,
    fullWidth = false,
}: {
    label: string;
    value: string;
    accent?: string;
    accentColor?: string;
    fullWidth?: boolean;
}) {
    return (
        <div
            style={{
                border: "1px solid #e6e6e6",
                borderRadius: 0,
                padding: 16,
                background: accent ?? "#fff",
                minHeight: fullWidth ? 88 : 76,
            }}
        >
            <div style={{ color: "#777", marginBottom: 8 }}>{label}</div>
            <strong style={{ color: accentColor ?? "#1c1c1c" }}>{value}</strong>
        </div>
    );
}

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

export default OrderDetailPage;
