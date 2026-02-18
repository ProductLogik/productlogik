import { Link } from "react-router";

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-600/20">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-display font-bold tracking-tight text-text-primary">Productlogik</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            The intelligent decision platform for modern product teams. Decode feedback, detect patterns, and deliver value.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Social placeholders */}
                            <div className="h-8 w-8 rounded-full bg-slate-100 hover:bg-brand-100 transition-colors"></div>
                            <div className="h-8 w-8 rounded-full bg-slate-100 hover:bg-brand-100 transition-colors"></div>
                            <div className="h-8 w-8 rounded-full bg-slate-100 hover:bg-brand-100 transition-colors"></div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-text-primary mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link to="/upload" className="hover:text-brand-600 transition-colors">Analyzer</Link></li>
                            <li><Link to="/dashboard" className="hover:text-brand-600 transition-colors">Intelligence Dashboard</Link></li>
                            <li><Link to="#" className="hover:text-brand-600 transition-colors">Integrations</Link></li>
                            <li><Link to="#" className="hover:text-brand-600 transition-colors">Enterprise</Link></li>
                            <li><Link to="/usage" className="hover:text-brand-600 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text-primary mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link to="#" className="hover:text-brand-600 transition-colors">Methodology</Link></li>
                            <li><Link to="#" className="hover:text-brand-600 transition-colors">Case Studies</Link></li>
                            <li><Link to="#" className="hover:text-brand-600 transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-brand-600 transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / Legal */}
                    <div>
                        <h4 className="font-bold text-text-primary mb-6">Stay Updated</h4>
                        <p className="text-sm text-text-secondary mb-4">Latest product strategy insights delivered to your inbox.</p>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                            />
                            <button className="bg-text-primary text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-brand-600 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p>&copy; {new Date().getFullYear()} Productlogik AI. All rights reserved.</p>
                        <span className="hidden md:inline text-slate-300">|</span>
                        <p>Created by <a href="https://www.hamzalatif.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">Hamza Latif</a></p>
                    </div>
                    <div className="flex gap-8">
                        <Link to="#" className="hover:text-text-primary">Privacy Policy</Link>
                        <Link to="#" className="hover:text-text-primary">Terms of Service</Link>
                        <Link to="#" className="hover:text-text-primary">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
