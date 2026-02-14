import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Outlet } from "react-router";

export function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-bg-default font-sans text-text-primary">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
