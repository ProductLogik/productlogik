import { Button } from "../ui/Button";
import { Link } from "react-router";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full glass border-b-0">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-xl font-display font-bold text-brand-600 flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">Productlogik</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/upload" className="text-sm font-medium text-text-secondary hover:text-brand-600 transition-colors">Analyzer</Link>
                    <Link to="/dashboard" className="text-sm font-medium text-text-secondary hover:text-brand-600 transition-colors">Dashboard</Link>
                    <Link to="/usage" className="text-sm font-medium text-text-secondary hover:text-brand-600 transition-colors">Pricing</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-white/50">
                        <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="shadow-brand-600/25">
                        <Link to="/upload">Start Analysis</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
