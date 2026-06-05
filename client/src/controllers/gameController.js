const BASE_URL = 'http://localhost:3001/api/games';

export async function fetchChallenge() {
    try {
        const response = await fetch(`${BASE_URL}/challenge`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching game challenge:", error);
        throw error;
    }
}

export async function submitGameRoute(routeData) {
    try {
        const response = await fetch(`${BASE_URL}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(routeData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error submitting game route:", error);
        throw error;
    }
}

export async function fetchGameHistory() {
    try {
        const response = await fetch(`${BASE_URL}/history`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching game history:", error);
        throw error;
    }
}