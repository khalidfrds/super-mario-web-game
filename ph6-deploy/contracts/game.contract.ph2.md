# GAME CONTRACT

**Project:** Super Mario Web Game  
**Phase:** Phase 2: HUD & Game Loop  
**ID:** PH2-MARIO-HUD  
**Status:** FROZEN

---

## 1. SCOPE OF THIS PHASE

Phase 2 adds the visible game loop around the movement core from Phase 1.
In this phase the player can collect coins, see the HUD, lose lives, run out of time, and reach a Game Over screen.

Phase 1 movement rules remain active and unchanged:
- Mario still moves and jumps with the same movement behavior
- Feel parameters from Phase 1 remain active
- Platforms and pits still behave as already defined in Phase 1

This contract adds only the mechanics listed below for Phase 2.

---

## 2. HUD

The HUD is always visible during active play and stays on top of the level view.
It contains exactly 4 elements:

### 2.1 Score
- Shows the player's current score
- Starts at 0 at the beginning of a new run
- Increases when a coin is collected
- Each collected coin adds **10** points
- Score remains visible at all times during play

### 2.2 Lives
- Shows the player's remaining lives
- Starting value: **3**
- Lives are shown as heart icons
- A remaining life is shown as a **full** heart
- A lost life slot is shown as an **empty** heart
- The HUD updates immediately after a life is lost

### 2.3 Coins
- Shows how many coins have been collected in the current run
- Starts at 0 at the beginning of a new run
- Increases by 1 each time a coin is collected
- The HUD updates immediately after each collected coin

### 2.4 Timer
- Shows the time remaining for the level
- Starting value: **400**
- Decreases at a speed of **1** unit per second while active play is running
- Always uses a **3-digit** format: `000`
- Examples of the display format: `400`, `099`, `008`, `000`

### 2.5 HUD placement
- **Score** is shown at the top-left area of the screen
- **Lives** is shown at the top-center area of the screen
- **Coins** is shown near the top area and remains clearly separated from Score and Timer
- **Timer** is shown at the top-right area of the screen

All 4 elements must remain readable without covering Mario or hiding critical level space.

---

## 3. COINS

### 3.1 Coin state machine

`spinning → collected`

### 3.2 Coin states

#### spinning
- The coin is visible in the level
- The coin plays a looping spinning animation
- The spinning animation uses **4** frames
- While in this state, the coin can be collected by Mario

#### collected
- The coin is no longer visible in the level
- The coin can no longer be collected again
- The coin no longer affects score or coin count

### 3.3 Coin transitions
- **spinning → collected**  
  Condition: Mario collects the coin  
  Result: Score increases by **10**, Coins increases by **1**, and the coin disappears

### 3.4 Coin behavior summary
- A coin starts in the `spinning` state
- A collected coin immediately changes to `collected`
- A collected coin does not return to `spinning` during the same run

---

## 4. LIVES

### 4.1 Starting value
- The player starts a new run with **3** lives

### 4.2 When a life is lost
A life is lost in exactly these cases during Phase 2:
- Mario falls into a pit
- The Timer reaches `000`

### 4.3 Result of losing a life
- Lives decreases by 1
- The HUD updates immediately
- If at least 1 life remains, the level restarts from its start point
- The Timer returns to **400** after the restart
- Collected coins for the current run remain counted only if the run has not ended in Game Over
- Score for the current run remains visible only until Game Over or manual restart

### 4.4 Lives = 0
- When the last life is lost, active play ends
- The player is taken to the Game Over screen

---

## 5. TIMER

### 5.1 Timer rules
- The Timer starts at **400**
- The Timer decreases by **1** each second during active play
- The Timer is always shown in **3-digit** format
- The Timer never shows a negative value

### 5.2 Timer reaching zero
- When the Timer reaches `000`, Mario dies
- The player loses **1** life
- If lives remain, the level restarts from the start point and the Timer resets to **400**
- If no lives remain, the player goes to the Game Over screen

---

## 6. GAME OVER

### 6.1 When Game Over happens
Game Over happens when Lives becomes `0`.

### 6.2 What the player sees
The Game Over screen shows:
- the message **GAME OVER**
- the final Score from the finished run
- a **RESTART** action

### 6.3 RESTART behavior
When the player chooses **RESTART**:
- Score resets to 0
- Coins resets to 0
- Lives resets to **3**
- Timer resets to **400**
- The game starts again from the beginning of the level

---

## 7. PHASE 1 FEEL PARAMETERS THAT REMAIN ACTIVE

These movement feel rules remain active in Phase 2 exactly as already defined in Phase 1.
They are still required during coin collection, timer pressure, life loss, and restart flow.

### 7.1 Coyote time
- Value: **80 milliseconds**
- If Mario has just left the edge of a platform, jump input still counts for a short moment
- This helps the player make edge jumps more reliably

### 7.2 Jump buffer
- Value: **100 milliseconds**
- If the player presses jump shortly before landing, the jump is accepted as soon as Mario reaches the ground
- This makes jump timing more forgiving

### 7.3 Variable jump
- Early release of the jump input cuts jump height
- Initial jump speed: **500 pixels per second upward**
- Minimum jump speed after early release: **200 pixels per second upward**
- This allows short hops and full jumps

---

## 8. NUMBERS USED IN THIS PHASE

Only the following phase-specific values are introduced or used directly in this contract:
- **COIN_SCORE = 10**
- **LIVES_START = 3**
- **LEVEL_TIMER_START = 400**

Inherited movement values from Phase 1 remain unchanged:
- Walk speed: **160 pixels per second**
- Run speed: **240 pixels per second**
- Initial jump speed: **500 pixels per second upward**
- Minimum jump speed: **200 pixels per second upward**
- Maximum fall speed: **600 pixels per second downward**
- Coyote time: **80 milliseconds**
- Jump buffer: **100 milliseconds**
- Mario hitbox: **20 × 26 pixels**

---

## 9. OUT OF SCOPE FOR THIS CONTRACT

This contract does not add or describe:
- enemies
- stomping combat
- question blocks
- mushroom power-up
- multiple levels
- pause system
- leaderboard
- backend features

