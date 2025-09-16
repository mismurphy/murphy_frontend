
export default async function Protected() {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
        const response = await fetch("http://localhost:5000/api/auth/token-validation", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });

        return response.ok;
    } catch {
        return false;
    }
}
