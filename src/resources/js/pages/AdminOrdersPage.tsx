import React from "react";

const orderRows = [
    {
        code: "#OD-20260522-01",
        customer: "Nguyễn Văn A",
        status: "Đang xử lý",
        total: "620.000đ",
    },
    {
        code: "#OD-20260522-02",
        customer: "Trần Thị B",
        status: "Đang giao",
        total: "1.245.000đ",
    },
    {
        code: "#OD-20260522-03",
        customer: "Lê Văn C",
        status: "Hoàn tất",
        total: "430.000đ",
    },
];

export default function AdminOrdersPage() {
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
                </div>

                <div className="admin-page__table-body">
                    {orderRows.map((row) => (
                        <article
                            key={row.code}
                            className="admin-page__table-row"
                        >
                            <strong>{row.code}</strong>
                            <span>{row.customer}</span>
                            <span>{row.status}</span>
                            <span>{row.total}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
