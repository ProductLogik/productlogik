const rawApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001/api";
export const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

// Types
export interface Theme {
    name: string;
    description?: string; // Analysis returns 'name', prompt generic says 'name'. Let's support both or just name.
    title?: string; // Some mocks used title
    confidence: number;
    sentiment: "Positive" | "Neutral" | "Negative" | "Critical";
    count: number;
    summary: string;
    evidence: string[];
}

export interface AnalysisResult {
    upload_id: string;
    filename: string;
    row_count: number;
    status: "pending" | "completed" | "failed";
    themes: Theme[];
    executive_summary: string;
    confidence_score: number;
    processing_time_ms: number;
    agile_risks?: any;
    created_at?: string;
    has_themes: boolean;
    message?: string;
}

export interface Upload {
    upload_id: string;
    filename: string;
    row_count: number;
    status: string;
    created_at: string;
    has_analysis: boolean;
    theme_count: number;
    owner_email?: string;
    owner_name?: string;
    shared_at?: string;
    permission?: string;
}

export async function login(email: string, password: string): Promise<{ access_token: string, token_type: string }> {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
    }

    return response.json();
}

export async function register(email: string, password: string, full_name: string, company_name: string): Promise<any> {
    console.log("Attempting to register:", email, "at", `${API_URL}/auth/register`);
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, full_name, company_name }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error body:", errorText);
            try {
                const error = JSON.parse(errorText);

                if (Array.isArray(error.detail)) {
                    const firstError = error.detail[0];
                    if (firstError && firstError.msg) {
                        const msg = firstError.msg.replace('Value error, ', '');
                        throw new Error(msg);
                    }
                }

                throw new Error(error.detail || "Registration failed");
            } catch (e: any) {
                if (e.message && e.message !== "Unexpected token 'E', \"Error bod\"... is not valid JSON") {
                    throw e;
                }
                throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
            }
        }

        return response.json();
    } catch (e) {
        console.error("Fetch error:", e);
        throw e;
    }
}

export async function getUserProfile(token: string): Promise<{
    id: string;
    email: string;
    full_name: string | null;
    company_name: string | null;
    role: string;
    created_at: string | null;
    usage_quota?: {
        plan_tier: string;
        analyses_limit: number;
        analyses_used: number;
    };
}> {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch profile");
    }

    return response.json();
}

export async function updateUserProfile(
    token: string,
    full_name?: string,
    company_name?: string
): Promise<{
    id: string;
    email: string;
    full_name: string | null;
    company_name: string | null;
    role: string;
    created_at: string | null;
    usage_quota?: {
        plan_tier: string;
        analyses_limit: number;
        analyses_used: number;
    };
}> {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name, company_name }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update profile");
    }

    return response.json();
}

export async function uploadCSV(file: File, token: string): Promise<{
    upload_id: string;
    filename: string;
    row_count: number;
    status: string;
    message: string;
}> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
    }

    return response.json();
}

export async function getUserUploads(token: string): Promise<{ uploads: Upload[] }> {
    const response = await fetch(`${API_URL}/uploads`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("401 Unauthorized");
        }
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch uploads");
    }

    return response.json();
}

export async function getAnalysis(uploadId: string, token: string): Promise<AnalysisResult> {
    const response = await fetch(`${API_URL}/analysis/${uploadId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch analysis");
    }

    return response.json();
}

export async function getSharedUploads(token: string): Promise<{ uploads: Upload[] }> {
    const response = await fetch(`${API_URL}/uploads/shared-with-me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch shared uploads");
    }

    return response.json();
}

export async function shareUpload(uploadId: string, email: string, token: string): Promise<any> {
    const response = await fetch(`${API_URL}/uploads/${uploadId}/share`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to share analysis");
    }

    return response.json();
}
export async function exportAnalysis(uploadId: string, token: string): Promise<Blob> {
    const response = await fetch(`${API_URL}/analysis/${uploadId}/export`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to export PDF");
    }

    return response.blob();
}
