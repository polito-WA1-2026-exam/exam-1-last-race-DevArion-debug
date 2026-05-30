import sqlite3 from 'sqlite3';

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