import React from "react";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";

interface CheckoutLayoutProps {}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = () => {
    return (
        <section className="checkout spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h6>
                            <span className="icon_tag_alt"></span> Have a
                            coupon? <a href="#">Click here</a> to enter your
                            code
                        </h6>
                    </div>
                </div>
                <div className="checkout__form">
                    <h4>Billing Details</h4>
                    <form action="#">
                        <div className="row">
                            <div className="col-lg-8 col-md-6">
                                <BillingForm />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <OrderSummary />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default CheckoutLayout;
