import React from "react";

const productRows = [
    {
        name: "Organic Vegetables Box",
        category: "Rau củ",
        stock: "Đang bán",
        price: "320.000đ",
    },
    {
        name: "Premium Fruit Basket",
        category: "Trái cây",
        stock: "Sắp hết hàng",
        price: "450.000đ",
    },
    {
        name: "Fresh Dairy Pack",
        category: "Sữa & thực phẩm",
        stock: "Ngừng bán",
        price: "280.000đ",
    },
];

export default function AdminProductsPage() {
    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">
                        Quản lý sản phẩm
                    </span>
                    <h1>Sản phẩm</h1>
                    <p>
                        Xem nhanh trạng thái sản phẩm, danh mục và giá hiển thị
                        trong hệ thống.
                    </p>
                </div>
            </div>

            <div className="admin-page__table-card">
                <div className="admin-page__table-head">
                    <span>Tên sản phẩm</span>
                    <span>Danh mục</span>
                    <span>Trạng thái</span>
                    <span>Giá</span>
                </div>

                <div className="admin-page__table-body">
                    {productRows.map((row) => (
                        <article
                            key={row.name}
                            className="admin-page__table-row"
                        >
                            <strong>{row.name}</strong>
                            <span>{row.category}</span>
                            <span>{row.stock}</span>
                            <span>{row.price}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
