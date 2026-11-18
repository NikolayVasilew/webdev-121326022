require('dotenv').config();

const bcrypt = require('bcryptjs');
const { openDatabase } = require('./database');

function seedDatabase(db) {
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      password_hash = excluded.password_hash,
      role = excluded.role
  `);

  const insertEvent = db.prepare(`
    INSERT INTO events (
      title,
      description,
      event_date,
      event_time,
      location,
      max_capacity,
      published
    )
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);

  insertUser.run(
    'Seeded Student',
    'student@example.com',
    bcrypt.hashSync('password123', 12),
    'user'
  );

  insertUser.run(
    'Seeded Administrator',
    'admin@example.com',
    bcrypt.hashSync('admin123', 12),
    'admin'
  );

  const eventCount = db.prepare('SELECT COUNT(*) AS count FROM events').get().count;

  if (eventCount === 0) {
    insertEvent.run(
      'Winter Coding Meetup',
      'A collaborative evening for students to build projects and share coding ideas.',
      '2026-12-05',
      '18:00',
      'Engineering Building, Room 204',
      40
    );
    insertEvent.run(
      'Student Club Social',
      'Meet club members, learn about upcoming activities, and enjoy free refreshments.',
      '2026-12-12',
      '16:30',
      'University Student Center',
      30
    );
    insertEvent.run(
      'Project Showcase',
      'Students present completed projects and receive feedback from peers and mentors.',
      '2026-12-19',
      '17:00',
      'Innovation Lab',
      50
    );
  }

  return true;
}

if (require.main === module) {
  const db = openDatabase();
  try {
    seedDatabase(db);
    console.log('Database initialized and seed data added.');
  } finally {
    db.close();
  }
}

module.exports = { seedDatabase };
