import React from "react";

export default function AdminDashboardPage() {
    return (
        <section className="admin-page admin-page--overview">
            <div className="admin-page__hero">
                <div>
                    <span className="admin-page__eyebrow">Tổng quan</span>
                    <h1>Bảng điều khiển quản trị</h1>
                    <p>
                        Quản lý nhanh sản phẩm, đơn hàng và trạng thái vận hành
                        của hệ thống từ một nơi.
                    </p>
                </div>

                <div className="admin-page__hero-card">
                    <strong>3</strong>
                    <span>khu vực chính trong sidebar</span>
                </div>
            </div>

            <div className="admin-page__stats">
                <article className="admin-page__stat">
                    <span>01</span>
                    <strong>Quản lý sản phẩm</strong>
                    <p>Đi đến danh sách và thao tác sản phẩm.</p>
                </article>

                <article className="admin-page__stat">
                    <span>02</span>
                    <strong>Quản lý đơn hàng</strong>
                    <p>Xem trạng thái xử lý và cập nhật đơn hàng.</p>
                </article>

                <article className="admin-page__stat">
                    <span>03</span>
                    <strong>Điều hướng nhanh</strong>
                    <p>Dùng sidebar để chuyển qua lại giữa các khu vực.</p>
                </article>
            </div>
        </section>
    );
}
