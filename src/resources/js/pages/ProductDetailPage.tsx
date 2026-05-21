import ProductTabs from "@/components/common/ProductTabs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import Breadcrumb from "@/components/ui/Breadcrumb";
import React from "react";

interface ProductDetailPageProps {}

const ProductDetailPage: React.FC<ProductDetailPageProps> = () => {
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Vegetables", path: "/shop" },
        { label: "Vegetable’s Package" },
    ];

    return (
        <>
            <Breadcrumb
                items={breadcrumbItems}
                backgroundImage="/img/breadcrumb.jpg"
            />
            <section className="product-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <ProductGallery />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <ProductInfo />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <ProductTabs />
                        </div>
                    </div>
                </div>
            </section>
            <RelatedProducts />
        </>
    );
};

export default ProductDetailPage;
