import mapService from "../services/mapService";

const mapController = {
     async getMapData(req, res, next) {
        try {
            const mapData = await mapService.getFullMapNetwork();
            return res.json(mapData);
        }
        catch (err) {
            return next(err);
            
        }
     }
}

export default mapController;