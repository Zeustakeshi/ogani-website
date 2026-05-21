import ProductGrid from "@/components/common/ProductGrid";
import ProductCount from "@/components/shop/ProductCount";
import ShopSidebar from "@/components/shop/ShopSidebar";
import SortBar from "@/components/shop/SortBar";

const ShopPage = () => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-5">
                        <ShopSidebar />
                    </div>
                    <div className="col-lg-9 col-md-7">
                        <div className="filter__item">
                            <div className="row">
                                <div className="col-lg-4 col-md-5">
                                    <SortBar />
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <ProductCount count={16} />
                                </div>
                                <div className="col-lg-4 col-md-3">
                                    <div className="filter__option">
                                        <span className="icon_grid-2x2"></span>
                                        <span className="icon_ul"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ProductGrid products={[]} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopPage;
