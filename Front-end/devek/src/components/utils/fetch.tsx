


export async function fetchAPI(token: string, user: string | null, payload: unknown, logOut: () => void, endpoint: string, method: string) {
    try {

        const req: RequestInit = {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-Consumer-Custom-Id": String(user),
            },
        };

        if (method === 'POST' || method === 'PUT') {
            req.body = JSON.stringify(payload);
        }


        const response = await fetch(endpoint, req);

        if (response.status === 401) {
            console.warn("Unauthorized request. Redirecting to login...");

            if (user !== null) {
                logOut();
            }

            throw new Error("Unauthorized request. Redirecting to login...");
        }

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to send message:", error);
        return null;
    }
}