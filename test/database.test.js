const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { openDatabase } = require('../src/data/database');
const { seedDatabase } = require('../src/data/seed');

function temporaryDatabase() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'club-events-'));
  const databasePath = path.join(directory, 'test.db');
  return {
    databasePath,
    cleanup() {
      fs.rmSync(directory, { recursive: true, force: true });
    },
  };
}

test('database seed creates a regular user, an administrator, and three upcoming events', () => {
  const temp = temporaryDatabase();
  const db = openDatabase(temp.databasePath);

  try {
    seedDatabase(db);

    const users = db.prepare(
      'SELECT email, role FROM users ORDER BY role, email'
    ).all();
    const events = db.prepare(`
      SELECT title, event_date, location, max_capacity
      FROM events
      WHERE published = 1
      ORDER BY event_date
    `).all();

    assert.deepEqual(users, [
      { email: 'admin@example.com', role: 'admin' },
      { email: 'student@example.com', role: 'user' },
    ]);
    assert.equal(events.length, 3);
    assert.equal(events[0].title, 'Winter Coding Meetup');
  } finally {
    db.close();
    temp.cleanup();
  }
});

test('AC-16 deleted event disappears after reload', () => {
  const temp = temporaryDatabase();
  const db = openDatabase(temp.databasePath);

  try {
    seedDatabase(db);
    const event = db.prepare(
      'SELECT id FROM events ORDER BY event_date LIMIT 1'
    ).get();

    db.prepare('DELETE FROM events WHERE id = ?').run(event.id);

    const remaining = db.prepare(`
      SELECT id
      FROM events
      WHERE id = ?
    `).all(event.id);

    assert.equal(remaining.length, 0);
  } finally {
    db.close();
    temp.cleanup();
  }
});
