export function buildStationLines(allSegments) {
    const stationLines = {};

    allSegments.forEach(segment => {
        if (!stationLines[segment.start_station]) {
            stationLines[segment.start_station] = new Set();
        }

        if (!stationLines[segment.end_station]) {
            stationLines[segment.end_station] = new Set();
        }

        stationLines[segment.start_station].add(segment.line_id);
        stationLines[segment.end_station].add(segment.line_id);
    });

    return stationLines;
}