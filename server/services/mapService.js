import eventsDAO from '../daos/eventsDAO.js';
import stationsDAO from '../daos/stationsDAO.js';
import segmentsDAO from '../daos/segmentsDAO.js';
import lineDAO from '../daos/lineDAO.js';

class MapService {
    async getFullMapNetwork() {
        const [events, stations, segments, lines] = await Promise.all([
            eventsDAO.getAllEvents(),
            stationsDAO.getAllStations(),
            segmentsDAO.getAllSegments(),
            lineDAO.getAllLines()
        ]);

        return { events, stations, segments, lines };
    }
}

export default new MapService();