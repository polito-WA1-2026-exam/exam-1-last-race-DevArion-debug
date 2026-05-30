import userDao from "../daos/userDAO.js";
import crypto from "crypto";
import userService from "../services/userService.js";

const authController = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await userService.verifyUserCredentials(email, password);
            
            if (!user) {
                return res.status(401).json({ error: 'Incorrect email or password.' });
            }

            req.login(user, (loginErr) => {
                if (loginErr) return next(loginErr);
                return res.json({ id: user.id, username: user.username, email: user.email });
            });

        } catch (err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        req.logout((err) => {
            if (err) return next(err);
            
            req.session.destroy((destroyErr) => {
                if (destroyErr) return next(destroyErr);
                
                res.clearCookie('connect.sid');
                return res.status(200).json({ message: 'Logged out successfully.' });
            });
        });
    },

    async getCurrentSession(req, res) {
        if (req.isAuthenticated()) {
            return res.json({
                id: req.user.id,
                username: req.user.username,
                email: req.user.email
            });
        }
        return res.status(401).json({ error: 'Not authenticated.' });
    }
};

export default authController;