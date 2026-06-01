// server/services/GameService.js
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
            if (!graph[segment.start]) graph[segment.start] = [];
            if (!graph[segment.end]) graph[segment.end] = [];

            graph[segment.start].push(segment.end);
            graph[segment.end].push(segment.start);
        });

        const queue = [startStationId];
        const visited = new Set([startStationId]);
        const distances = {};
        distances[startStationId] = 0;

        while (queue.length > 0) {
            const current = queue.shift();
            const neighbors = graph[current] || [];

            neighbors.forEach(neighborId => {
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    distances[neighborId] = distances[current] + 1;
                    queue.push(neighborId);
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

        const segmentMap = new Map(
            allSegments.map(segment => [segment.id, segment])
        );

        const stationLines = buildStationLines(allSegments);

        const currentTime = Date.now();
        const totalElapsedTime = (currentTime - startTime) / 1000;

        if (totalElapsedTime > 90) return invalidResponse;
        if (!routeSegmentIds || routeSegmentIds.length === 0) return invalidResponse;

        const submittedSegments = routeSegmentIds.map(id => segmentMap.get(id));
        if (submittedSegments.some(segment => segment === undefined)) return invalidResponse;

        let currentPlayerLocation = startStationId;

        for (let i = 0; i < submittedSegments.length; i++) {
            const currentSegment = submittedSegments[i];

            const isAtStart = currentSegment.start === currentPlayerLocation;
            const isAtEnd = currentSegment.end === currentPlayerLocation;

            if (!isAtStart && !isAtEnd) return invalidResponse;

            const nextPlayerLocation = isAtStart ? currentSegment.end : currentSegment.start;

            if (i < submittedSegments.length - 1) {
                const nextSegment = submittedSegments[i + 1];

                if (currentSegment.line_name !== nextSegment.line_name) {
                    const interchangeStation = nextPlayerLocation;
                    const linesAtStation = stationLines[interchangeStation]?.size || 0;

                    if (linesAtStation <= 1) return invalidResponse;
                }
            }
            currentPlayerLocation = nextPlayerLocation;
        }

        if (currentPlayerLocation !== endStationId) return invalidResponse;

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
            const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];

            finalScore += randomEvent.effect;
            executionSteps.push({
                segmentId: segment.id,
                startStation: segment.start,
                endStation: segment.end,
                lineName: segment.line_name,
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