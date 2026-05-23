import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import NavigationMenu from "@/layout/NavigationMenu";
import TopBar from "@/layout/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Preloader from "../ui/Preloader";
import HamburgerMenu from "../ui/HamburgerMenu";
import { PATHS } from "@/router/paths";
import ChatbotWidget from "@/components/ui/ChatbotWidget";

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>("[data-setbg]");

        elements.forEach((element) => {
            const imagePath = element.dataset.setbg;

            if (!imagePath) {
                return;
            }

            const normalizedPath = imagePath.startsWith("/")
                ? imagePath
                : `/${imagePath}`;

            element.style.backgroundImage = `url(${normalizedPath})`;
            element.style.backgroundSize = "cover";
            element.style.backgroundPosition = "center center";
            element.style.backgroundRepeat = "no-repeat";
        });
    }, [location.pathname]);

    if (user?.role === "admin") {
        return <Navigate to={PATHS.ADMIN} replace />;
    }

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

            <ChatbotWidget />

            <Footer />
        </>
    );
}
