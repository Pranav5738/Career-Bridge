const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const isFormPayload = (body) => body instanceof FormData || body instanceof Blob;

const readAuthToken = () => {
    try {
        return localStorage.getItem("token") || "";
    } catch {
        return "";
    }
};

export const apiRequest = async (path, options = {}) => {
    const {
        method = "GET",
        body,
        headers = {},
        auth = true,
        signal,
    } = options;

    const requestHeaders = new Headers(headers);

    if (auth) {
        const token = readAuthToken();
        if (token) {
            requestHeaders.set("Authorization", `Bearer ${token}`);
        }
    }

    let requestBody = body;

    if (body !== undefined && body !== null && !isFormPayload(body)) {
        requestHeaders.set("Content-Type", "application/json");
        requestBody = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal,
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new Error(payload?.message || `Request failed with status ${response.status}`);
    }

    return payload;
};

export { API_BASE_URL };