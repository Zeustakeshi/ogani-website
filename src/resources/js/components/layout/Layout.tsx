import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import NavigationMenu from "@/layout/NavigationMenu";
import TopBar from "@/layout/TopBar";
import { Outlet } from "react-router-dom";
import Preloader from "../ui/Preloader";
import { useState } from "react";
import HamburgerMenu from "../ui/HamburgerMenu";

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* <Preloader /> */}

            <Header />

            {isMobileMenuOpen && (
                <HamburgerMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
            )}

            <main className="site-main">
                <Outlet />
            </main>

            <Footer />
        </>
    );
}
