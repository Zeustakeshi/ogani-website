import React from "react";
import BillingForm from "./BillingForm";
import OrderSummary from "./OrderSummary";

type CheckoutItem = {
    image: string;
    name: string;
    price: number;
    quantity: number;
};

interface BillingFormValues {
    address: string;
    orderNote: string;
    onAddressChange: (value: string) => void;
    onOrderNoteChange: (value: string) => void;
}

interface CheckoutLayoutProps {
    items?: CheckoutItem[];
    subtotal?: number;
    total?: number;
    isLoading?: boolean;
    errorMessage?: string | null;
    isPlacingOrder?: boolean;
    onPlaceOrder?: () => void;
    billingForm?: BillingFormValues;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
    items = [],
    subtotal = 0,
    total = 0,
    isLoading = false,
    errorMessage,
    isPlacingOrder = false,
    onPlaceOrder,
    billingForm,
}) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section className="checkout spad">
            <div className="container">
                {isLoading && (
                    <div className="row">
                        <div className="col-lg-12">
                            <p>Đang tải thông tin thanh toán...</p>
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <div className="row">
                        <div className="col-lg-12">
                            <p>{errorMessage}</p>
                        </div>
                    </div>
                )}
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
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-8 col-md-6">
                                <BillingForm
                                    address={billingForm?.address ?? ""}
                                    orderNote={billingForm?.orderNote ?? ""}
                                    onAddressChange={
                                        billingForm?.onAddressChange ??
                                        (() => undefined)
                                    }
                                    onOrderNoteChange={
                                        billingForm?.onOrderNoteChange ??
                                        (() => undefined)
                                    }
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <OrderSummary
                                    items={items}
                                    subtotal={subtotal}
                                    total={total}
                                    onPlaceOrder={onPlaceOrder}
                                    isPlacingOrder={isPlacingOrder}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default CheckoutLayout;
