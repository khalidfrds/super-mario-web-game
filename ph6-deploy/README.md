# 🎮 Super Mario Web Game

A browser-based 2D platformer built with **Phaser 3 + TypeScript + Vite**.  
3 levels · Enemies · Power-ups · Leaderboard · Desktop + Mobile.

---

## 🗂 Project Structure

```
super-mario-game/
  frontend/   — Phaser 3 game (Vite + TypeScript)
  backend/    — Express API + SQLite leaderboard
  contracts/  — Game & tech contracts (frozen)
```

---

## 🚀 Deploy

### Step 1 — Backend on Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select this repo, choose **`backend/`** as the Root Directory
3. In Railway dashboard → **Variables**, add:

| Variable | Value |
|---|---|
| `FRONTEND_URL` | `https://your-app.vercel.app` *(update after Vercel deploy)* |
| `LEADERBOARD_LIMIT` | `10` |
| `RANK_START_INDEX` | `1` |
| `HTTP_STATUS_OK` | `200` |
| `HTTP_STATUS_BAD_REQ` | `400` |
| `HTTP_STATUS_ERROR` | `500` |

4. After deploy → verify: `GET https://your-app.up.railway.app/api/health` → `{"status":"ok"}`

---

### Step 2 — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import this repo
2. Set **Root Directory** to `frontend/`
3. In Vercel → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-app.up.railway.app` |

4. Deploy → copy your Vercel URL.

---

### Step 3 — Update CORS on Railway

In Railway → Variables → update:
```
FRONTEND_URL = https://your-app.vercel.app
```
Redeploy backend. Done ✅

---

### Smoke Test

- [ ] `GET https://your-app.up.railway.app/api/health` → 200 OK
- [ ] Game loads at Vercel URL
- [ ] Win screen → submit score → Leaderboard shows Top-10

---

## 💻 Local Development

```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Frontend (new terminal)
cd frontend && npm install && cp .env.example .env.local && npm run dev
```

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Game Engine | Phaser 3.60.0 |
| Language | TypeScript 5.4.2 (strict) |
| Build | Vite 5.2.0 |
| Backend | Express 4.19.0 |
| Database | better-sqlite3 9.4.0 |
| Frontend Host | Vercel |
| Backend Host | Railway |

---

Assets: [Kenney.nl](https://kenney.nl) CC0 1.0 Universal
