import db from '../db.js';

class LineDAO {
    getAllLines(){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM lines';
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

export default new LineDAO();