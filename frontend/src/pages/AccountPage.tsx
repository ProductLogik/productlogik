import { Button } from "../components/ui/Button";
import { Link } from "react-router";
import { User, LogOut, CreditCard } from "lucide-react";

export function AccountPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl">
                <h1 className="text-2xl font-bold text-text-primary mb-8">Account Settings</h1>

                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                    <div className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-text-primary">Jane Doe</h2>
                            <p className="text-sm text-text-secondary">jane.doe@company.com</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Subscription</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <span className="text-text-primary font-medium">Pro Plan</span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/usage">View Usage</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        <Button variant="destructive" className="w-full justify-center gap-2">
                            <LogOut className="h-4 w-4" /> Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
