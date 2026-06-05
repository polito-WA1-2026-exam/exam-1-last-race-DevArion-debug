import gameDAO from "../daos/gameDAO.js";
import segmentsDAO from "../daos/segmentsDAO.js";
import stationsDAO from "../daos/stationsDAO.js";
import eventsDAO from "../daos/eventsDAO.js";
import { buildStationLines } from "../helpers/buildStationLinesHelper.js";

class GameService {
    async calculateMinDistance(startStationId) {
    const allSegments = await segmentsDAO.getAllSegments();
    const graph = {};

    allSegments.forEach(segment => {
        if (!graph[segment.start_station]) graph[segment.start_station] = [];
        graph[segment.start_station].push({ ...segment, to: segment.end_station });

        if (!graph[segment.end_station]) graph[segment.end_station] = [];
        graph[segment.end_station].push({ ...segment, to: segment.start_station });
    });

    const queue = [startStationId];
    const visited = new Set();
    const distances = {};
    distances[startStationId] = 0;

    while (queue.length > 0) {
        const current = queue.shift();
        visited.add(current);
        const neighbors = graph[current] || [];
        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor.to)) {
                const newDistance = distances[current] + 1;
                if (distances[neighbor.to] === undefined || newDistance < distances[neighbor.to]) {
                    distances[neighbor.to] = newDistance;
                    queue.push(neighbor.to);
                }
            }
        });
    }
    return distances;
}

    async generateChallenge() {
        const allStations = await stationsDAO.getAllStations();
        let randomStart = null;
        let validDestinations = [];

        while (validDestinations.length === 0) {
            randomStart = allStations[Math.floor(Math.random() * allStations.length)];
            const stops = await this.calculateMinDistance(randomStart.id);
            validDestinations = allStations.filter(station => stops[station.id] >= 3);
        }

        const randomEnd = validDestinations[Math.floor(Math.random() * validDestinations.length)];

        return {
            startStation: randomStart,
            endStation: randomEnd
        };
    }

    async validateRoute(routeSegmentIds, startStationId, endStationId, startTime) {
    const allSegments = await segmentsDAO.getAllSegments();
    const invalidResponse = { isValid: false, submittedSegments: [] };

    if (!startStationId || !endStationId || !routeSegmentIds || routeSegmentIds.length === 0) {
        return invalidResponse;
    }

    const uniqueSegmentIds = new Set(routeSegmentIds);
    if (uniqueSegmentIds.size !== routeSegmentIds.length) {
        return invalidResponse;
    }

    const segmentMap = new Map(allSegments.map(s => [s.id, s]));
    const stationLines = buildStationLines(allSegments);

    const currentTime = Date.now();
    if ((currentTime - startTime) / 1000 > 90) return invalidResponse;

    const submittedSegments = [];
    let currentStationId = startStationId;
    let previousLineId = null;

    for (let i = 0; i < routeSegmentIds.length; i++) {
        const segment = segmentMap.get(routeSegmentIds[i]);
        if (!segment) return invalidResponse;

        const isAtStart = segment.start_station === currentStationId;
        const isAtEnd = segment.end_station === currentStationId;

        if (!isAtStart && !isAtEnd) {
            return invalidResponse; 
        }

        if (previousLineId !== null && previousLineId !== segment.line_id) {
            const linesAtStation = stationLines[currentStationId]?.size || 0;
            if (linesAtStation <= 1) return invalidResponse;
        }

        currentStationId = isAtStart ? segment.end_station : segment.start_station;
        previousLineId = segment.line_id;
        
        submittedSegments.push(segment);
    }

    if (currentStationId !== endStationId) {
        return invalidResponse;
    }

    return {
        isValid: true,
        submittedSegments
    };
}

    async executeRoute(submittedSegments) {
        const allEvents = await eventsDAO.getAllEvents();

        let finalScore = 20;
        const executionSteps = [];

        for (const segment of submittedSegments) {
            const randomEvent =
                allEvents[Math.floor(Math.random() * allEvents.length)];

            finalScore += randomEvent.coin_effect;

            executionSteps.push({
                segmentId: segment.id,
                startStation: segment.start_station,
                endStation: segment.end_station,
                lineId: segment.line_id,
                eventName: randomEvent.name,
                eventDescription: randomEvent.description,
                coinChange: randomEvent.coin_effect,
                runningTotal: finalScore
            });
        }

        if (finalScore < 0) {
            finalScore = 0;
        }

        return {
            finalScore,
            executionSteps
        };
    }

    async validateAndExecuteRoute(routeSegmentIds, startStationId, endStationId, startTime, userId) {
        const validationResult = await this.validateRoute(routeSegmentIds, startStationId, endStationId, startTime);

        if (!validationResult.isValid) {
            await gameDAO.createGame(userId, 0);

            return {
                isValid: false,
                finalScore: 0,
                executionSteps: []
            };
        }

        const executionResult = await this.executeRoute(validationResult.submittedSegments);

        await gameDAO.createGame(userId, executionResult.finalScore);

        return {
            isValid: true,
            finalScore: executionResult.finalScore,
            executionSteps: executionResult.executionSteps
        };
    }

    async getUserGameHistory(userId) {
        return await gameDAO.getGamesByUserId(userId);
    }
}

export default new GameService();