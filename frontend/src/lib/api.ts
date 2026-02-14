export const API_URL = "http://127.0.0.1:8001/api";

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

export async function register(email: string, password: string, full_name: string, company_name: string): Promise<{ access_token: string, token_type: string }> {
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

                // Handle Pydantic specific validation errors (Array of errors)
                if (Array.isArray(error.detail)) {
                    // Extract the first meaningful message, typically from 'msg'
                    const firstError = error.detail[0];
                    if (firstError && firstError.msg) {
                        // Clean up "Value error, " prefix if present (common in Pydantic)
                        const msg = firstError.msg.replace('Value error, ', '');
                        throw new Error(msg);
                    }
                }

                throw new Error(error.detail || "Registration failed");
            } catch (e: any) {
                // If we preserved the error object above, rethrow it. Otherwise fallback.
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
