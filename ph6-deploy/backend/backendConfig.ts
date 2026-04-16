// backend/backendConfig.ts
// Named constants for backend — all values read from env (see .env / .env.example)

export const DEFAULT_PORT      = process.env.DEFAULT_PORT
export const LEADERBOARD_LIMIT = parseInt(process.env.LEADERBOARD_LIMIT as string)
export const RANK_START_INDEX  = parseInt(process.env.RANK_START_INDEX  as string)
export const HTTP_STATUS_OK    = parseInt(process.env.HTTP_STATUS_OK    as string)
export const HTTP_STATUS_BAD_REQ = parseInt(process.env.HTTP_STATUS_BAD_REQ as string)
export const HTTP_STATUS_ERROR   = parseInt(process.env.HTTP_STATUS_ERROR   as string)
