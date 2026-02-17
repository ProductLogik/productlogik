import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router";
import { User, LogOut, CreditCard, Edit2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../lib/api";

export function AccountPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedCompany, setEditedCompany] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const data = await getUserProfile(token);
            setProfile(data);
            setEditedName(data.full_name || "");
            setEditedCompany(data.company_name || "");
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const updated = await updateUserProfile(token, editedName, editedCompany);
            setProfile(updated);
            setIsEditing(false);
            setSaving(false);
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedName(profile?.full_name || "");
        setEditedCompany(profile?.company_name || "");
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    <p className="text-text-secondary">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-text-primary">Account Settings</h1>
                    {!isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-2"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    )}
                </div>

                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                <User className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-text-secondary mb-1 block">Full Name</label>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-secondary mb-1 block">Company</label>
                                            <input
                                                type="text"
                                                value={editedCompany}
                                                onChange={(e) => setEditedCompany(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                placeholder="Company name"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-lg font-medium text-text-primary">
                                            {profile?.full_name || "No name set"}
                                        </h2>
                                        <p className="text-sm text-text-secondary">
                                            {profile?.company_name || "No company"}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Email</span>
                                    <span className="text-text-primary font-medium">{profile?.email}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Role</span>
                                    <span className="text-text-primary font-medium capitalize">{profile?.role}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Member since</span>
                                    <span className="text-text-primary font-medium">
                                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex gap-3 mt-6">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Subscription</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <span className="text-text-primary font-medium">Free Plan</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/usage")}>
                                View Usage
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        <Button
                            variant="destructive"
                            className="w-full justify-center gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" /> Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
