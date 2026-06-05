
export async function fetchMapData() {
    try {
        const response = await fetch('http://localhost:3001/api/map', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching map data:", error);
        throw error;
    }
}
