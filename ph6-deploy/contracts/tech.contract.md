═══════════════════════════════════════════════════════════════════════════════
TECH CONTRACT
Phase 6: Leaderboard & Polish
ID: PH6-MARIO-FINAL
Версия: 1.0
Статус: DRAFT
Базовый контракт: game.contract.md Phase 6 (FROZEN / Fix-line aligned)
═══════════════════════════════════════════════════════════════════════════════

## 1. BACKEND SETUP

### 1.1 Backend structure
  Структура backend/:
    - backend/server.ts
    - backend/db.ts
    - backend/routes/scores.ts

  Назначение:
    - server.ts: create Express app, middleware, CORS, route mounting, listen
    - db.ts: SQLite connection + schema bootstrap
    - routes/scores.ts: health endpoint + scores endpoints

### 1.2 SQLite schema
  Таблица: scores

  Поля:
    - id
    - name
    - score
    - created_at

  Паттерн:
    1. db.ts opens SQLite database on backend startup
    2. ensure schema exists before route handlers start serving requests
    3. created_at заполняется на backend side
    4. score хранится как целочисленное значение результата полной игры

### 1.3 Express app bootstrap
  Порядок вызовов:
    1. read PORT from env
    2. read FRONTEND_URL from env
    3. create express app
    4. enable JSON body parser
    5. configure CORS with origin = FRONTEND_URL
    6. initialize database/schema
    7. mount routes under /api
    8. start listen on PORT

### 1.4 Frontend API configuration
  Источник API URL:
    - import.meta.env.VITE_API_URL

  Правила:
    - frontend не хардкодит backend URL
    - все HTTP запросы WinScene и LeaderboardScene строятся от VITE_API_URL
    - отсутствие VITE_API_URL обрабатывается как runtime configuration error
      без краша приложения

---

## 2. API CONTRACTS

### 2.1 GET /api/health
  Response shape:
    - { status: 'ok' }

  Порядок:
    1. request arrives
    2. route returns JSON object with status='ok'
    3. no database read required

### 2.2 GET /api/scores
  Response shape:
    - [{ rank, name, score }]

  Порядок:
    1. request arrives
    2. query scores ordered by score DESC
    3. limit result set to Top-10
    4. map rows to rank + name + score
    5. return JSON array

  Правила:
    - rank формируется в response order
    - created_at не обязателен во frontend response
    - outside Top-10 rows are not returned

### 2.3 POST /api/scores
  Request shape:
    - { name, score }

  Response shape:
    - { id, name, score }

  Порядок:
    1. request arrives
    2. validate body presence
    3. validate name is non-empty after trim
    4. validate score is a number and not negative
    5. insert row into scores table
    6. return inserted id + name + score

### 2.4 Validation failures
  Паттерн:
    - invalid name → reject request
    - invalid score → reject request
    - malformed JSON body → reject request

  Правило:
    - validation failure returns error response
    - backend does not write invalid row into database

---

## 3. SOUND MANAGER

### 3.1 Module structure
  Класс:
    - src/audio/SoundManager.ts

  Источник аудио:
    - все audio assets загружаются только в PreloadScene через this.load.audio

  Передача экземпляра:
    - shared instance stored in scene.registry

### 3.2 SoundManager responsibilities
  Методы:
    - playCoin()
    - playJump()
    - playStomp()
    - playDie()
    - playMusic()
    - stopMusic()
    - pauseMusic()
    - resumeMusic()

  Правила:
    - event sounds are one-shot playback
    - music is looped background playback
    - music lifecycle managed centrally, not scattered across scenes

### 3.3 Registry handoff
  Порядок:
    1. create SoundManager after audio assets are available
    2. store instance in scene.registry
    3. GameScene, WinScene and other consumers read same shared instance
    4. do not create competing music instances per scene transition

### 3.4 PreloadScene audio setup
  Порядок:
    1. preload coin audio
    2. preload jump audio
    3. preload stomp audio
    4. preload die audio
    5. preload music audio
    6. create SoundManager only after preload phase finished

---

## 4. STATE TRANSITIONS

### 4.1 WinScene: open → submit ready
  Порядок вызовов:
    1. WinScene receives final payload with score and lives
    2. render victory message
    3. render final score
    4. render remaining lives
    5. render player name input
    6. render Submit action
    7. set isSubmitting = false

### 4.2 WinScene: submit ready → submitting
  Порядок вызовов:
    1. guard: if (isSubmitting) return
    2. read input value
    3. trim player name
    4. guard: if trimmed name is empty → abort submit path
    5. guard: if final score is invalid → abort submit path
    6. isSubmitting = true
    7. disable repeated submit action in UI
    8. send POST request to VITE_API_URL + /api/scores
    9. wait for response

### 4.3 WinScene: submitting → submit success
  Порядок вызовов:
    1. receive successful POST response
    2. mark result as saved
    3. keep player in WinScene final flow
    4. show success result state
    5. show Leaderboard action
    6. isSubmitting = false

### 4.4 WinScene: submitting → submit failure
  Порядок вызовов:
    1. receive request failure or validation failure
    2. show fallback/error message
    3. re-enable submit action
    4. isSubmitting = false

### 4.5 WinScene: success → LeaderboardScene
  Порядок вызовов:
    1. user chooses Leaderboard action
    2. this.scene.stop('WinScene')
    3. this.scene.stop('GameScene')
    4. this.scene.start('LeaderboardScene')

### 4.6 LeaderboardScene: open → loaded
  Порядок вызовов:
    1. scene opens
    2. render loading state
    3. send GET request to VITE_API_URL + /api/scores
    4. receive Top-10 response
    5. map rows to visible ranking list
    6. render rank, name, score for each row
    7. keep screen read-only

### 4.7 LeaderboardScene: open → fallback
  Порядок вызовов:
    1. scene opens
    2. request fails
    3. render fallback message
    4. do not crash scene
    5. keep navigation controls available

### 4.8 Sound event: coin
  Порядок вызовов:
    1. successful coin collection logic completes
    2. score/coins state update path runs
    3. soundManager.playCoin()

  Примечание:
    - same method used for level coin and QuestionBlock coin reward

### 4.9 Sound event: jump
  Порядок вызовов:
    1. jump input accepted
    2. player jump velocity applied
    3. soundManager.playJump()

### 4.10 Sound event: stomp
  Порядок вызовов:
    1. stomp detection accepted
    2. enemy stomp transition path runs
    3. player.applyStompBounce() or equivalent bounce path runs
    4. score update path runs
    5. soundManager.playStomp()

### 4.11 Sound event: die
  Порядок вызовов:
    1. death path accepted
    2. gameplay death flags set
    3. soundManager.playDie()
    4. continue existing respawn or GameOver flow

### 4.12 Music: inactive → playing
  Порядок вызовов:
    1. GameScene.loadLevel(levelIndex) completes level setup
    2. resolve SoundManager from registry
    3. guard: if music already playing → return
    4. soundManager.playMusic()

### 4.13 Music: playing → paused
  Порядок вызовов:
    1. pause flow accepted
    2. soundManager.pauseMusic()
    3. launch PauseScene
    4. pause GameScene

  Примечание:
    - pauseMusic() использовать до или вместе с scene pause path
    - не заменять этот переход на stopMusic()

### 4.14 Music: paused → playing
  Порядок вызовов:
    1. PauseScene Resume action accepted
    2. stop PauseScene
    3. resume GameScene
    4. soundManager.resumeMusic()

### 4.15 Music: playing → stopped on GameOver
  Порядок вызовов:
    1. GameOver transition accepted
    2. soundManager.stopMusic()
    3. launch or show GameOverScene

### 4.16 Music: playing → stopped on Win
  Порядок вызовов:
    1. final win transition accepted
    2. soundManager.stopMusic()
    3. launch WinScene

### 4.17 Music and respawn
  Порядок:
    1. respawn path resets level runtime state
    2. guard: if current music is already playing → keep current music state
    3. do not call playMusic() again for same active run after ordinary respawn

---

## 5. EDGE CASES

### 5.1 API unavailable
  Симптом:
    LeaderboardScene или WinScene не могут получить ответ от backend.
  Причина:
    backend недоступен, CORS blocked или VITE_API_URL задан неверно.
  Решение:
    Показать fallback message и сохранить работоспособность сцены.
    Ошибка сети не должна крашить игру.

### 5.2 Empty player name on submit
  Симптом:
    Отправляется пустое или пробельное имя.
  Причина:
    submit path запускается без trim/validation guard.
  Решение:
    Trim input before submit.
    If name is empty after trim → request not sent.

### 5.3 Double submit
  Симптом:
    Один и тот же результат отправляется несколько раз подряд.
  Причина:
    Submit button остаётся активной во время pending request.
  Решение:
    Guard:
      if (isSubmitting) return
    и disable repeated submit UI until request settles.

### 5.4 Sound asset missing or not ready
  Симптом:
    playCoin()/playJump()/playMusic() бросают runtime error.
  Причина:
    asset key missing или sound object not initialized yet.
  Решение:
    SoundManager methods perform silent fail when sound key or instance
    is unavailable. Игра не должна падать из-за звука.

### 5.5 Music restarts on respawn
  Симптом:
    При каждой смерти и respawn музыка начинается заново.
  Причина:
    respawn path вызывает playMusic() без guard on already playing.
  Решение:
    In playMusic path:
      if music already playing → do nothing.
    Ordinary respawn does not restart current background track.

### 5.6 Pause music handled as stop/play
  Симптом:
    После Pause → Resume музыка начинается заново с начала.
  Причина:
    Pause flow использует stopMusic()/playMusic() вместо pause/resume pair.
  Решение:
    PauseScene path uses pauseMusic() and resumeMusic() only.

### 5.7 CORS misconfiguration
  Симптом:
    Frontend on Vercel не может обращаться к backend on Railway.
  Причина:
    backend hardcodes origin or omits FRONTEND_URL env usage.
  Решение:
    CORS origin must be read from env FRONTEND_URL and applied at app setup.

### 5.8 Hardcoded API URL
  Симптом:
    Local build works, deployed build cannot reach backend.
  Причина:
    frontend hardcodes localhost or fixed domain.
  Решение:
    Use only import.meta.env.VITE_API_URL as API base source.

### 5.9 Scene listener accumulation with audio/UI
  Симптом:
    Submit handlers or scene buttons fire multiple times after re-entry.
  Причина:
    scene events/listeners recreated without cleanup.
  Решение:
    Apply off/on pattern for scene events and input listeners.
    In shutdown() remove input listeners and scene event bindings.

### 5.10 Music lifecycle on GameOver / Win / Pause
  Симптом:
    Music keeps playing under GameOver or Win, or stops incorrectly on Pause.
  Причина:
    lifecycle transitions not split into stop vs pause behavior.
  Решение:
    - GameOver → stopMusic()
    - WinScene → stopMusic()
    - Pause → pauseMusic()
    - Resume → resumeMusic()

### 5.11 PH5 delayed transition lesson
  Симптом:
    planned delayed transitions break when scene pause happens too early.
  Причина:
    paused scene stops its time events.
  Решение:
    Any delayed transition needed in PH6 must finish its timer-driven path
    before pausing owner scene, or use existing already-safe PH5 flow
    without changing its timing order.

---

## 6. SCENE SETUP CHECKLIST

### 6.1 PreloadScene
  1. Load all existing sprite assets
  2. Load audio assets:
       coin
       jump
       stomp
       die
       music
  3. After preload completion, create shared SoundManager
  4. Store SoundManager in registry

### 6.2 GameScene
  1. Resolve SoundManager from registry
  2. Keep existing PH1–PH5 setup unchanged
  3. In loadLevel(levelIndex), after level setup completes:
       call playMusic() with guard against duplicate playback
  4. In pause flow:
       pauseMusic() → launch PauseScene → pause GameScene
  5. In GameOver flow:
       stopMusic() before GameOverScene
  6. In final Win flow:
       stopMusic() before WinScene
  7. In ordinary respawn flow:
       do not restart music if same track is already playing
  8. In shutdown():
       remove listeners and cleanup scene-local resources

### 6.3 WinScene
  1. Read final score/lives payload
  2. Render name input and Submit action
  3. Track isSubmitting flag
  4. On valid submit:
       POST /api/scores
  5. On success:
       show Leaderboard action
  6. On failure:
       show fallback/error message
  7. Cleanup input listeners in shutdown()

### 6.4 LeaderboardScene
  1. On open, render loading state
  2. GET /api/scores from VITE_API_URL
  3. Render Top-10 list
  4. On failure, render fallback message
  5. Cleanup input listeners and pending scene-local handlers in shutdown()

### 6.5 Backend
  1. Read env variables
  2. Create app in backend/server.ts
  3. Enable JSON parser
  4. Configure CORS from FRONTEND_URL
  5. Initialize SQLite schema through backend/db.ts
  6. Register /api/health
  7. Register /api/scores GET
  8. Register /api/scores POST through backend/routes/scores.ts
  9. Start server on PORT

═══════════════════════════════════════════════════════════════════════════════
TECH CONTRACT ГОТОВ
Phase 6: Leaderboard & Polish
Создан: AGENT 04-T (Tech Architect)
Статус: DRAFT — ожидает проверки AGENT 01
═══════════════════════════════════════════════════════════════════════════════