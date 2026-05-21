import React from "react";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";
// import Breadcrumb from '../ui/Breadcrumb';

interface CheckoutLayoutProps {}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = () => {
    return (
        <section className="checkout spad">
            <div className="container">
                {/* Breadcrumb Area */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="checkout__content">
                            {/* <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Checkout' }]} /> */}
                            <div className="breadcrumb__links">
                                <a href="./index.html">
                                    <i className="fa fa-home"></i> Home
                                </a>
                                <span>Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coupon Alert */}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="coupon__code">
                            <h6>
                                Have a coupon? <a href="#">Click here</a> to
                                enter your code
                            </h6>
                        </div>
                    </div>
                </div>

                {/* Main Checkout Area */}
                <div className="row">
                    <div className="col-lg-6">
                        <BillingForm />
                    </div>
                    <div className="col-lg-6">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutLayout;
