import Breadcrumb from "@/components/ui/Breadcrumb";
import { PATHS } from "@/router/paths";
import { sendMomoCallback } from "@/services/payment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type ReturnStatus = "processing" | "success" | "failed";

const MomoReturnPage: React.FC = () => {
    const location = useLocation();
    const hasSubmittedRef = useRef(false);
    const [status, setStatus] = useState<ReturnStatus>("processing");
    const [message, setMessage] = useState(
        "Đang xác nhận kết quả thanh toán...",
    );
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (hasSubmittedRef.current) {
            return;
        }

        hasSubmittedRef.current = true;

        const queryParams = Object.fromEntries(
            new URLSearchParams(location.search).entries(),
        );

        if (Object.keys(queryParams).length === 0) {
            setStatus("failed");
            setMessage("Không nhận được dữ liệu thanh toán từ MoMo.");
            return;
        }

        (async () => {
            try {
                const response = await sendMomoCallback(queryParams);

                if (response.data.success) {
                    setStatus("success");
                    setMessage(response.data.message);
                    setOrderId(
                        response.data.data?.order_id ??
                            queryParams.orderId ??
                            null,
                    );
                    return;
                }

                setStatus("failed");
                setMessage(
                    response.data.message ||
                        "Thanh toán không thành công. Vui lòng thử lại.",
                );
                setOrderId(queryParams.orderId ?? null);
            } catch (error) {
                const fallbackMessage =
                    error instanceof Error
                        ? error.message
                        : "Không thể xác nhận kết quả thanh toán.";

                setStatus("failed");
                setMessage(fallbackMessage);
                setOrderId(queryParams.orderId ?? null);
            }
        })();
    }, [location.search]);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Xác nhận thanh toán" },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="checkout__order">
                                <h4>Thanh toán MoMo</h4>
                                {status === "processing" && <p>{message}</p>}
                                {status === "success" && (
                                    <>
                                        <p>{message}</p>
                                        {orderId && (
                                            <p>Mã đơn hàng: #{orderId}</p>
                                        )}
                                        <Link
                                            to={PATHS.ORDERS}
                                            className="site-btn"
                                        >
                                            Đi tới Quản lý đơn hàng
                                        </Link>
                                    </>
                                )}
                                {status === "failed" && (
                                    <>
                                        <p>{message}</p>
                                        {orderId && (
                                            <p>Mã đơn hàng: #{orderId}</p>
                                        )}
                                        <Link
                                            to={PATHS.CHECKOUT}
                                            className="site-btn"
                                        >
                                            Thanh toán lại
                                        </Link>
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

export default MomoReturnPage;
