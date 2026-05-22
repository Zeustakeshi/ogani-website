import Breadcrumb from "@/components/ui/Breadcrumb";
import React from "react";
import { Link } from "react-router-dom";

const OrdersPage: React.FC = () => {
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Quản lý đơn hàng" },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="checkout__order">
                                <h4>Quản lý đơn hàng</h4>
                                <p>
                                    Trang tổng hợp đơn hàng của bạn sẽ được hoàn
                                    thiện ở bước tiếp theo.
                                </p>
                                <Link to="/" className="site-btn">
                                    Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrdersPage;
