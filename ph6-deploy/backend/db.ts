// backend/db.ts
// SQLite connection + schema bootstrap — tech contract 1.2

import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.resolve(__dirname, '..', 'scores.db')

const db = new Database(DB_PATH)

// Tech contract 1.2: ensure schema exists before route handlers
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

export default db
