import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./db.sqlite');

class UserDAO {
    createUser(username, email, hash, salt) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, email, hash, salt) VALUES (?, ?, ?, ?)';

            db.run(sql, [username, email, hash, salt], function (err) {
                if (err) {

                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    loginUser(username, hash) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ? AND hash = ?';
            db.get(sql, [username, hash], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }


    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    getUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}


export default new UserDAO();