import sqlite3 from 'sqlite3';

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
            const sql = 'SELECT id, score, date_played FROM games WHERE user_id = ? ORDER BY score DESC';
            db.all(sql, [userId], (err, rows) => {
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