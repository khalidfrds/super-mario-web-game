// backend/src/routes/scores.ts
// API routes for health + scores — tech contract section 2

import { Router, Request, Response } from 'express'
import db from '../db'
import {
  LEADERBOARD_LIMIT,
  RANK_START_INDEX,
  HTTP_STATUS_BAD_REQ,
  HTTP_STATUS_ERROR
} from '../backendConfig'

const router = Router()

// Tech contract 2.1: GET /api/health
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Tech contract 2.2: GET /api/scores — Top-10 DESC
router.get('/scores', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare(
      'SELECT id, name, score FROM scores ORDER BY score DESC LIMIT ?'
    ).all(LEADERBOARD_LIMIT) as { id: number; name: string; score: number }[]

    const ranked = rows.map((row, index) => ({
      rank: index + RANK_START_INDEX,
      name: row.name,
      score: row.score
    }))

    res.json(ranked)
  } catch {
    res.status(HTTP_STATUS_ERROR).json({ error: 'Failed to fetch scores' })
  }
})

// Tech contract 2.3: POST /api/scores
router.post('/scores', (req: Request, res: Response) => {
  try {
    const { name, score } = req.body as { name: unknown; score: unknown }

    // Tech contract 2.4: validation
    if (typeof name !== 'string' || name.trim().length === 0) {
      res.status(HTTP_STATUS_BAD_REQ).json({ error: 'Name is required' })
      return
    }

    if (typeof score !== 'number' || score < 0 || !Number.isFinite(score)) {
      res.status(HTTP_STATUS_BAD_REQ).json({ error: 'Score must be a non-negative number' })
      return
    }

    const trimmedName = name.trim()
    const intScore = Math.floor(score)

    const result = db.prepare(
      'INSERT INTO scores (name, score) VALUES (?, ?)'
    ).run(trimmedName, intScore)

    res.json({
      id: result.lastInsertRowid,
      name: trimmedName,
      score: intScore
    })
  } catch {
    res.status(HTTP_STATUS_ERROR).json({ error: 'Failed to save score' })
  }
})

export default router
