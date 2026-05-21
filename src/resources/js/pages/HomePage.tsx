import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroBanner from "@/components/home/HeroBanner";
import LatestProducts from "@/components/home/LatestProducts";
import ReviewProducts from "@/components/home/ReviewProducts";
import TopRatedProducts from "@/components/home/TopRatedProducts";
import React from "react";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
    return (
        <>
            <HeroBanner />
            <Categories />
            <FeaturedProducts />
            <section className="latest-product spad">
                <div className="container">
                    <div className="row">
                        <LatestProducts />
                        <TopRatedProducts />
                        <ReviewProducts />
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
