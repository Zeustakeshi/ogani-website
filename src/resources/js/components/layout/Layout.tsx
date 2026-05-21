import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import NavigationMenu from "@/layout/NavigationMenu";
import TopBar from "@/layout/TopBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <TopBar />
            <Header />
            <NavigationMenu />

            <main className="site-main">
                <Outlet />
            </main>

            <Footer />
        </>
    );
}
