import gameService from "../services/gameService.js";

const gameController = {

    async startGame(req, res, next) {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ error: 'Not authenticated.' });
            }

            const challenge = await gameService.generateChallenge();

            const startTime = Date.now();

            req.session.activeRace = {
                startStationId: challenge.startStation.id,
                endStationId: challenge.endStation.id,
                startTime
            };

            return res.json({
                startStation: challenge.startStation,
                endStation: challenge.endStation,
                startTime
            });

        } catch (err) {
            return next(err);
        }
    },

    async submitRoute(req, res, next) {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ error: 'Unauthorized.' });
            }

            if (!req.session.activeRace) {
                return res.status(400).json({ error: 'No active game challenge found.' });
            }

            const { startStationId, endStationId, startTime } = req.session.activeRace;
            const { routeSegmentIds } = req.body;
            const userId = req.user.id;

            const result = await gameService.validateAndExecuteRoute(
                routeSegmentIds,
                startStationId,
                endStationId,
                startTime,
                userId
            );

            delete req.session.activeRace;

            let message = 'Route verified successfully! Commencing journey.';

            if (!result.isValid) {
                message = result.timeLimitExceeded
                    ? 'Security Timeout: Submission arrived outside the authorized 90-second window. Score reset to 0.'
                    : 'Invalid or incomplete route structure. Route skipped, final score reset to 0.';
            }

            return res.json({
                success: true,
                isValid: result.isValid,
                finalScore: result.finalScore,
                executionSteps: result.executionSteps,
                message
            });

        } catch (err) {
            return next(err);
        }
    },

    async getUserHistory(req, res, next) {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ error: 'Unauthorized.' });
            }

            const userId = req.user.id;
            const gameHistory = await gameService.getUserGameHistory(userId);

            return res.json(gameHistory);
        } catch (err) {
            return next(err);
        }
    }
};

export default gameController;