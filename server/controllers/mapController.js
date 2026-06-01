import mapService from "../services/mapService.js";

const mapController = {
    async getMapData(req, res, next) {
        try {
            const mapData = await mapService.getFullMapNetwork();
            return res.status(200).json(mapData);
        } catch (error) {
            console.error("Error fetching map network network layout:", error);
            return res.status(500).json({ error: "Failed to retrieve map components." });
        }
    }
};

export default mapController;