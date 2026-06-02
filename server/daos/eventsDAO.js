import db from "../db.js";
class EventsDAO {
    getAllEvents() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM events';
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

export default new EventsDAO();