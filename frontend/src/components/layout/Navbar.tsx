import { Button } from "../ui/Button";
import { Link } from "react-router";
import { User, LogOut, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if user is logged in
        const checkLoginState = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        };

        checkLoginState();

        // Listen for login/logout events
        const handleStorageChange = () => {
            checkLoginState();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("loginStateChanged", handleStorageChange);

        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("loginStateChanged", handleStorageChange);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setShowUserMenu(false);
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 w-full glass border-b-0">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-xl font-display font-bold text-brand-600 flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">ProductLogik</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/upload" className="text-sm font-medium text-text-secondary hover:text-brand-600 transition-colors">Analyzer</Link>
                    <Link to="/dashboard" className="text-sm font-medium text-text-secondary hover:text-brand-600 transition-colors">Dashboard</Link>
                    <Link to="/usage" className="text-sm font-medium text-text-secondary hover:text-brand-600 transition-colors">Pricing</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-text-primary hidden sm:inline">Account</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                    <Link
                                        to="/account"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        Account Settings
                                    </Link>
                                    <Link
                                        to="/usage"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        Usage & Billing
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-white/50">
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <Button asChild className="shadow-brand-600/25">
                                <Link to="/signup">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
