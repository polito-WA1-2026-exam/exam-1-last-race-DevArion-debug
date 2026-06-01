import express from 'express';
import GameService from '../services/GameService.js';

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authenticated. Please log in first.' });
};

router.get('/challenge', isLoggedIn, async (req, res) => {
    try {
        const challenge = await GameService.generateChallenge();
        return res.status(200).json(challenge);
    } catch (error) {
        console.error('Error generating challenge:', error);
        return res.status(500).json({ error: 'Failed to generate game challenge.' });
    }
});


router.post('/submit', isLoggedIn, async (req, res) => {
    try {
        const { routeSegmentIds, startStationId, endStationId, startTime } = req.body;
        
        const userId = req.user.id; 

        if (!routeSegmentIds || !startStationId || !endStationId || !startTime) {
            return res.status(400).json({ error: 'Missing mandatory game play records.' });
        }

        const result = await GameService.validateAndExecuteRoute(
            routeSegmentIds,
            Number(startStationId),
            Number(endStationId),
            Number(startTime),
            userId
        );

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error processing route submission:', error);
        return res.status(500).json({ error: 'Server error processing the game route.' });
    }
});

router.get('/history', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await GameService.getUserGameHistory(userId);
        return res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching game history:', error);
        return res.status(500).json({ error: 'Failed to retrieve game history.' });
    }
});

export default router;