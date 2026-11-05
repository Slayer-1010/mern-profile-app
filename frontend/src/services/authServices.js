const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    })

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || result.msg || "Registration Failed."
        )
    }

    return result;
}

export async function loginUser(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials : "include",
        body: JSON.stringify(credentials)
    })

    const result = await response.json()
    
    if (!response.ok) {
        throw new Error(
            result.message || result.msg || "Login failed."
        );
    }

    return result;
}
