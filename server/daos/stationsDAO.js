import db from "../db.js";
class StationsDAO {
    getAllStations() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM stations';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    }
}

export default new StationsDAO();