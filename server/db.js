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
      name TEXT NOT NULL UNIQUE,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL
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
      line_id INTEGER NOT NULL,
      start_station INTEGER NOT NULL, 
      end_station INTEGER NOT NULL,   
      FOREIGN KEY (line_id) REFERENCES lines(id),
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
      { name: 'Centrale', x: 150, y: 200 },
      { name: 'Porta Susa', x: 280, y: 120 },
      { name: 'Bernini', x: 420, y: 180 },
      { name: 'Rivoli', x: 520, y: 280 },
      { name: 'Massaua', x: 280, y: 280 },
      { name: 'Pozzo Strada', x: 180, y: 380 },
      { name: 'Marche', x: 520, y: 400 },
      { name: 'Paradiso', x: 420, y: 320 },
      { name: 'Fermi', x: 620, y: 220 },
      { name: 'Carducci', x: 80, y: 250 },
      { name: 'Dante', x: 350, y: 450 },
      { name: 'Nizza', x: 480, y: 480 }
    ];  
    
    const stmtStation = db.prepare('INSERT INTO stations (name, x, y) VALUES (?, ?, ?)');
    stations.forEach(s => stmtStation.run(s.name, s.x, s.y));
    stmtStation.finalize();

    const lines = [
      { name: 'Red Line', color: '#ef4444' },    
      { name: 'Blue Line', color: '#3b82f6' },   
      { name: 'Green Line', color: '#10b981' },  
      { name: 'Yellow Line', color: '#eab308' }
    ];
    const stmtLine = db.prepare('INSERT INTO lines (name, color) VALUES (?, ?)');
    lines.forEach(l => stmtLine.run(l.name, l.color));
    stmtLine.finalize();

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
      { lineId: 1, start: 1, end: 2 },
      { lineId: 1, start: 2, end: 3 },
      { lineId: 1, start: 3, end: 4 },
      
      { lineId: 2, start: 1, end: 5 },
      { lineId: 2, start: 5, end: 6 },
      { lineId: 2, start: 6, end: 7 },
      
      { lineId: 3, start: 2, end: 8 },
      { lineId: 3, start: 8, end: 9 },
      { lineId: 3, start: 9, end: 10 },
      
      { lineId: 4, start: 3, end: 11 },
      { lineId: 4, start: 11, end: 12 },
      { lineId: 4, start: 12, end: 7 }
    ];
    const stmtSegment = db.prepare('INSERT INTO segments (line_id, start_station, end_station) VALUES (?, ?, ?)');
    segments.forEach(s => stmtSegment.run(s.lineId, s.start, s.end));
    stmtSegment.finalize();

    const defaultUsers = [
      { user: 'user1', email: 'user1@polito.it' },
      { user: 'user2', email: 'user2@polito.it' },
      { user: 'user3', email: 'user3@polito.it' }
    ];

    defaultUsers.forEach(u => {
      const salt = crypto.randomBytes(16).toString('hex');
      const derivedKey = crypto.scryptSync('password123', salt, 32);
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