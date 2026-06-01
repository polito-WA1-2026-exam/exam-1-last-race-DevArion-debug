import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    throw err;
  }
  console.log('Connected to the SQLite database.');
});

db.get('PRAGMA foreign_keys = ON');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      hash TEXT NOT NULL,
      salt TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,  
      effect INTEGER NOT NULL      
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS segments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      line_name TEXT NOT NULL,
      start_station INTEGER NOT NULL, 
      end_station INTEGER NOT NULL,   
      FOREIGN KEY (start_station) REFERENCES stations(id),
      FOREIGN KEY (end_station) REFERENCES stations(id)
    );
  `);

  db.get('SELECT COUNT(*) AS count FROM stations', [], (err, row) => {
    if (err) return console.error(err.message);
    if (row.count === 0) {
      seedData();
    }
  });
});

function seedData() {
  db.serialize(() => {
    const stations = [
      'Centrale', 'Porta Susa', 'Bernini', 'Rivoli', 'Massaua', 
      'Pozzo Strada', 'Marche', 'Paradiso', 'Fermi', 'Carducci', 
      'Dante', 'Nizza'
    ];
    const stmtStation = db.prepare('INSERT INTO stations (name) VALUES (?)');
    stations.forEach(name => stmtStation.run(name));
    stmtStation.finalize();

    const events = [
      { desc: 'Train delayed due to technical issues', eff: -2 },
      { desc: 'Smooth transit with zero queueing', eff: 2 },
      { desc: 'Wrong platform entry penalty', eff: -1 },
      { desc: 'Express route alternative opened', eff: 3 },
      { desc: 'Severe signal failures across lines', eff: -4 },
      { desc: 'Caught an early connector train', eff: 1 },
      { desc: 'Ticket barrier technical malfunction', eff: -3 },
      { desc: 'Perfect synchronization sprint bonus', eff: 4 }
    ];
    const stmtEvent = db.prepare('INSERT INTO events (description, effect) VALUES (?, ?)');
    events.forEach(e => stmtEvent.run(e.desc, e.eff));
    stmtEvent.finalize();

    const segments = [
      { line: 'Red Line', start: 1, end: 2 },
      { line: 'Red Line', start: 2, end: 3 },
      { line: 'Red Line', start: 3, end: 4 },
      
      { line: 'Blue Line', start: 1, end: 5 },
      { line: 'Blue Line', start: 5, end: 6 },
      { line: 'Blue Line', start: 6, end: 7 },
      
      { line: 'Green Line', start: 2, end: 8 },
      { line: 'Green Line', start: 8, end: 9 },
      { line: 'Green Line', start: 9, end: 10 },
      
      { line: 'Yellow Line', start: 3, end: 11 },
      { line: 'Yellow Line', start: 11, end: 12 },
      { line: 'Yellow Line', start: 12, end: 7 }
    ];
    const stmtSegment = db.prepare('INSERT INTO segments (line_name, start_station, end_station) VALUES (?, ?, ?)');
    segments.forEach(s => stmtSegment.run(s.line, s.start, s.end));
    stmtSegment.finalize();

    const defaultUsers = [
      { user: 'user1', email: 'user1@polito.it' },
      { user: 'user2', email: 'user2@polito.it' },
      { user: 'user3', email: 'user3@polito.it' }
    ];

    defaultUsers.forEach(u => {
      const salt = crypto.randomBytes(16).toString('hex');
      const derivedKey = crypto.scryptSync('password123', salt, 64);
      const hash = derivedKey.toString('hex');
      db.run(
        'INSERT INTO users (username, email, hash, salt) VALUES (?, ?, ?, ?)',
        [u.user, u.email, hash, salt]
      );
    });

    const pastGames = [
      { userId: 1, score: 24 },
      { userId: 1, score: 14 },
      { userId: 2, score: 32 },
      { userId: 2, score: 8 }
    ];
    const stmtGame = db.prepare('INSERT INTO games (user_id, score) VALUES (?, ?)');
    pastGames.forEach(g => stmtGame.run(g.userId, g.score));
    stmtGame.finalize();
  });
}

export default db;