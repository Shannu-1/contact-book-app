const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'contacts.db');

async function init() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  await db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
  )`);
  return db;
}

async function createContact({ name, email, phone }) {
  const db = await init();
  const result = await db.run(
    'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)',
    [name, email, phone]
  );
  const id = result.lastID;
  return { id, name, email, phone };
}

async function getContacts({ limit = 10, offset = 0 }) {
  const db = await init();
  const rows = await db.all('SELECT * FROM contacts ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
  const countRow = await db.get('SELECT COUNT(*) as count FROM contacts');
  return { contacts: rows, total: countRow.count };
}

async function deleteContact(id) {
  const db = await init();
  await db.run('DELETE FROM contacts WHERE id = ?', [id]);
}

module.exports = { createContact, getContacts, deleteContact };