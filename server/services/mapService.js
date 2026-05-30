import eventsDAO from '../daos/eventsDAO.js';
import stationsDAO from '../daos/stationsDAO.js';
import segmentsDAO from '../daos/segmentsDAO.js';

class MapService {
    async getFullMapNetwork() {
        const [events, stations, segments] = await Promise.all([
            eventsDAO.getAllEvents(),
            stationsDAO.getAllStations(),
            segmentsDAO.getAllSegments()
        ]);

        return { events, stations, segments };
    }
}

export default new MapService();