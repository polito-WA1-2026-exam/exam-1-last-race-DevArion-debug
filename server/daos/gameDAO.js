import db from "../db.js";
class GameDAO {
    createGame(userId, score) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO games (user_id, score) VALUES (?, ?)';
            db.run(sql, [userId, score], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    getGamesByUserId(userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, score FROM games WHERE user_id = ? ORDER BY score DESC';
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getGeneralRanking() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    u.id AS userId,
                    u.username,
                    COALESCE(MAX(g.score), 0) AS bestScore,
                    COUNT(g.id) AS gamesPlayed
                FROM users u
                LEFT JOIN games g ON g.user_id = u.id
                GROUP BY u.id, u.username
                ORDER BY bestScore DESC, u.username ASC
            `;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

export default new GameDAO();