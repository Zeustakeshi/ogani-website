import CheckoutLayout from "@/components/checkout/CheckoutLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React from "react";

interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Checkout" },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <CheckoutLayout />
        </>
    );
};

export default CheckoutPage;
