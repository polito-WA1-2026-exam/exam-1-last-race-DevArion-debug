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
        const invalidResponse = (reason) => ({ isValid: false, submittedSegments: [], reason });

        if (!startStationId || !endStationId || !Number.isInteger(startTime)) {
            return invalidResponse("Invalid challenge data");
        }

        if (!Array.isArray(routeSegmentIds) || routeSegmentIds.length === 0) {
            return invalidResponse("Empty route");
        }

        if (!routeSegmentIds.every(Number.isInteger)) {
            return invalidResponse("Route contains invalid segment identifiers");
        }

        const uniqueSegmentIds = new Set(routeSegmentIds);
        if (uniqueSegmentIds.size !== routeSegmentIds.length) {
            return invalidResponse("A segment was selected more than once");
        }

        const currentTime = Date.now();
        if ((currentTime - startTime) / 1000 > 90) {
            return invalidResponse("Time limit exceeded");
        }

        const segmentMap = new Map(allSegments.map(s => [s.id, s]));
        const stationLines = buildStationLines(allSegments);

        const submittedSegments = [];
        let currentStationId = startStationId;
        let previousLineId = null;

        for (const segmentId of routeSegmentIds) {
            const segment = segmentMap.get(segmentId);

            if (!segment) {
                return invalidResponse("Unknown segment");
            }

            const isAtStart = segment.start_station === currentStationId;
            const isAtEnd = segment.end_station === currentStationId;

            if (!isAtStart && !isAtEnd) {
                return invalidResponse("Selected segment is not reachable from the current station");
            }

            if (previousLineId !== null && previousLineId !== segment.line_id) {
                const linesAtCurrentStation = stationLines[currentStationId] ?? new Set();

                if (
                    !linesAtCurrentStation.has(previousLineId) ||
                    !linesAtCurrentStation.has(segment.line_id)
                ) {
                    return invalidResponse("Line change attempted outside an interchange station");
                }
            }

            currentStationId = isAtStart
                ? segment.end_station
                : segment.start_station;

            previousLineId = segment.line_id;
            submittedSegments.push(segment);

        }

        if (currentStationId !== endStationId) {
            return invalidResponse("Route does not end at the assigned destination");
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

            finalScore += randomEvent.effect;

            executionSteps.push({
                segmentId: segment.id,
                startStation: segment.start_station,
                endStation: segment.end_station,
                lineId: segment.line_id,
                eventDescription: randomEvent.description,
                coinChange: randomEvent.effect,
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
                executionSteps: [],
                reason: validationResult.reason,
                timeLimitExceeded: validationResult.reason === "Time limit exceeded"
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

    async getGeneralRanking() {
        return await gameDAO.getGeneralRanking();
    }
}

export default new GameService();