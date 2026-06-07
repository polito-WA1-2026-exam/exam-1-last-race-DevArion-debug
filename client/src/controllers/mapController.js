
export async function fetchMapData() {
    try {
        const response = await fetch('http://localhost:3001/api/map', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching map data:", error);
        throw error;
    }
}
