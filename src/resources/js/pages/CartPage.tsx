import CartActions from "@/components/cart/CartActions";
import CartSummary from "@/components/cart/CartSummary";
import CartTable from "@/components/cart/CartTable";
import CouponInput from "@/components/cart/CouponInput";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PATHS } from "@/router/paths";
import React from "react";

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = () => {
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Shopping Cart" },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <section className="shoping-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <CartTable />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <CartActions continueHref={PATHS.SHOP} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="shoping__continue">
                                <CouponInput />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <CartSummary checkoutHref={PATHS.CHECKOUT} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CartPage;
