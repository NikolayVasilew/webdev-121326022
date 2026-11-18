const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function openDatabase(databasePath) {
  const resolvedPath = databasePath || process.env.DATABASE_PATH || path.join(__dirname, '..', '..', 'data', 'club-events.db');

  fs.mkdirSync(path.dirname(path.resolve(resolvedPath)), { recursive: true });

  const db = new Database(resolvedPath);
  db.pragma('foreign_keys = ON');

  const schemaPath = path.join(__dirname, 'schema.sql');
  db.exec(fs.readFileSync(schemaPath, 'utf8'));

  return db;
}

module.exports = { openDatabase };
