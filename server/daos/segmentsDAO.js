import db from "../db.js";
class SegmentsDAO {
    getAllSegments() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM segments';
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

export default new SegmentsDAO();