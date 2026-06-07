import stationsDAO from '../daos/stationsDAO.js';
import segmentsDAO from '../daos/segmentsDAO.js';
import lineDAO from '../daos/lineDAO.js';

class MapService {
    async getFullMapNetwork() {
        const [stations, segments, lines] = await Promise.all([
            stationsDAO.getAllStations(),
            segmentsDAO.getAllSegments(),
            lineDAO.getAllLines()
        ]);

        return { stations, segments, lines };
    }
}

export default new MapService();