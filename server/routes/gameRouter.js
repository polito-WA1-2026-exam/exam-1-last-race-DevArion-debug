import express from 'express';
import gameController from '../controllers/gameController.js';

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({
        error: 'Not authenticated. Please log in first.'
    });
};

router.get('/challenge', isLoggedIn, gameController.startGame);

router.post('/submit', isLoggedIn, gameController.submitRoute);

router.get('/history', isLoggedIn, gameController.getUserHistory);

router.get('/ranking', isLoggedIn, gameController.getGeneralRanking);

export default router;