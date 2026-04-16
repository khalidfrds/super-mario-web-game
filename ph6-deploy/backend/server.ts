// backend/server.ts
// Express server entry point — tech contract 1.3

import express from 'express'
import cors from 'cors'
import scoresRouter from './routes/scores'

// Tech contract 1.3 step 1-2: read env (defaults defined in .env / .env.example)
const PORT = process.env.PORT || process.env.DEFAULT_PORT
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.DEFAULT_FRONTEND_URL

// Tech contract 1.3 step 3: create express app
const app = express()

// Tech contract 1.3 step 4: enable JSON body parser
app.use(express.json())

// Tech contract 1.3 step 5: configure CORS — origin from env
app.use(cors({
  origin: FRONTEND_URL
}))

// Tech contract 1.3 step 6: database initialized on import of db.ts via routes

// Tech contract 1.3 step 7: mount routes under /api
app.use('/api', scoresRouter)

// Tech contract 1.3 step 8: start listen on PORT
app.listen(PORT, () => {
  // Server running
})
