# GAME CONTRACT

**Project:** Super Mario Web Game  
**Phase:** Phase 3: Enemies  
**ID:** PH3-MARIO-ENEMIES  
**Status:** FROZEN

---

## 1. SCOPE

Phase 3 adds enemy combat on top of Phase 1 and Phase 2.
The movement rules from Phase 1 remain active, and the HUD, score, coins, lives, timer, and Game Over flow from Phase 2 remain active.

This phase adds:
- Goomba enemy behavior
- Koopa enemy behavior
- stomp combat
- shell behavior
- Mario damage from enemies
- respawn rules after losing a life to an enemy

The movement feel rules from Phase 1 also remain active in this phase:
- Coyote time: **80 milliseconds**
- Jump buffer: **100 milliseconds**
- Variable jump: early release cuts jump height
- Stomp bounce after a successful stomp: **300 pixels per second upward**

---

## 2. GOOMBA

### 2.1 Goomba state machine

`patrolling → dead`

### 2.2 Goomba states

#### patrolling
- The Goomba walks forward at a constant patrol speed
- Patrol speed: **60 pixels per second**
- Hitbox: **28 × 24 pixels**
- While patrolling, the Goomba is dangerous to Mario from the side or from below
- When the Goomba reaches a wall, it turns around and keeps patrolling
- When the Goomba reaches the edge of a platform, it turns around and keeps patrolling

#### dead
- The Goomba has been defeated by a stomp from above
- The Goomba shows a defeated animation
- The Goomba no longer damages Mario
- After the defeated animation, the Goomba disappears from the level

### 2.3 Goomba transitions
- **patrolling → dead**  
  Condition: Mario lands on the Goomba from above during a stomp  
  Result: the Goomba is defeated, Mario gets a bounce upward, and the score increases by **100**

### 2.4 Goomba interactions
- **Wall contact:** the Goomba turns around
- **Platform edge:** the Goomba turns around
- **Stomp from above:** the Goomba enters `dead`, shows its defeat reaction, then disappears
- **Touch from the side or from below:** Mario takes damage

### 2.5 Goomba scoring
- Defeating a Goomba by stomp gives **100** points

---

## 3. KOOPA

### 3.1 Koopa state machine

`patrolling → in_shell → shell_sliding`

### 3.2 Koopa states

#### patrolling
- The Koopa walks forward at a constant patrol speed
- Patrol speed: **50 pixels per second**
- Hitbox: **28 × 40 pixels**
- While patrolling, the Koopa damages Mario from the side or from below
- When the Koopa reaches a wall, it turns around and keeps patrolling
- When the Koopa reaches the edge of a platform, it turns around and keeps patrolling

#### in_shell
- The Koopa pulls into its shell after being stomped from above
- Shell hitbox: **28 × 24 pixels**
- In this state, the shell stays in place until it is touched again
- A shell in this state is not moving yet

#### shell_sliding
- The shell moves quickly across the ground
- Shell speed: **300 pixels per second**
- Shell hitbox: **28 × 24 pixels**
- When the sliding shell hits a wall, it turns around and keeps sliding
- A sliding shell damages Mario on contact
- A sliding shell defeats enemies on contact

### 3.3 Koopa transitions
- **patrolling → in_shell**  
  Condition: Mario lands on the Koopa from above during a stomp  
  Result: the Koopa retracts into its shell, Mario gets a bounce upward, and the score increases by **150**

- **in_shell → shell_sliding**  
  Condition: Mario touches the shell  
  Result: the shell is kicked and starts sliding across the level

- **shell_sliding → shell_sliding**  
  Condition: the sliding shell hits a wall  
  Result: the shell turns around and continues sliding

### 3.4 Koopa interactions
- **Touch from the side or from below while patrolling:** Mario takes damage
- **Stomp from above while patrolling:** Koopa enters `in_shell`
- **Touching a shell that is waiting in place:** the shell starts sliding
- **Touching a sliding shell:** Mario takes damage
- **Sliding shell hitting a Goomba:** the Goomba is defeated and the score increases by **200**
- **Sliding shell hitting another Koopa in patrolling state:** that Koopa is forced into `in_shell`

### 3.5 Koopa scoring
- Stomping a Koopa into its shell gives **150** points
- Defeating an enemy with a sliding shell gives **200** points

---

## 4. STOMP DETECTION

A stomp is defined by the direction and position of Mario at the moment of contact.

A contact counts as a stomp when all of the following are true:
- Mario is coming down from a jump or fall
- Mario reaches the enemy from above
- Mario's feet meet the enemy's top side before a side body contact is established

When those conditions are met:
- the enemy reacts to a stomp
- Mario is pushed back upward with a stomp bounce of **300 pixels per second upward**
- the correct score reward is applied

A contact does **not** count as a stomp when:
- Mario touches the enemy from the side
- Mario touches the enemy from below
- Mario is not descending onto the enemy

In those cases, Mario takes damage instead of defeating the enemy.

---

## 5. MARIO DAMAGE

### 5.1 What can damage Mario in Phase 3
Mario takes damage from:
- touching a Goomba from the side
- touching a Goomba from below
- touching a patrolling Koopa from the side
- touching a patrolling Koopa from below
- touching a sliding Koopa shell

### 5.2 Immediate result of damage
When Mario takes damage:
- the hit is accepted only once
- Mario loses **1** life through the life system introduced in Phase 2
- Mario shows a blinking recovery state
- Mario cannot take another hit during the immunity window

### 5.3 Damage immunity
- Immunity duration: **2000 milliseconds**
- During this time, enemy contact does not remove another life
- The blinking effect makes this protection visible to the player

### 5.4 Link to Phase 2 life system
- Enemy damage uses the same life system as pits and timer loss from Phase 2
- If Mario still has remaining lives after the hit, play continues through respawn
- If Mario has no lives left after the hit, the game goes to Game Over

---

## 6. RESPAWN AFTER LOSING A LIFE

When Mario loses a life to an enemy, the respawn rules are:

### 6.1 What resets
- Mario returns to the level start position
- All enemies return to their starting positions and starting states
- All coins return to their starting positions and collectible state
- The level combat layout is restored to its starting condition

### 6.2 What is preserved
- Score is preserved
- Coins count is preserved
- Lives is preserved except for the life that was just lost

### 6.3 Resulting flow
- Mario takes damage from an enemy
- Lives decreases by **1**
- If at least **1** life remains, the level playfield is reset and Mario respawns at the start point
- If lives becomes `0`, the game goes to Game Over instead of respawn

---

## 7. NUMBERS USED IN THIS PHASE

Only the following Phase 3 numbers are introduced or used directly in this contract:
- **GOOMBA_SPEED = 60**
- **KOOPA_SPEED_PATROL = 50**
- **KOOPA_SPEED_SHELL = 300**
- **GOOMBA_STOMP_SCORE = 100**
- **KOOPA_STOMP_SCORE = 150**
- **KOOPA_SHELL_KILL_SCORE = 200**
- **STOMP_BOUNCE_VELOCITY = 300** upward
- **INVINCIBILITY_MS = 2000**
- **GOOMBA hitbox = 28 × 24**
- **KOOPA hitbox = 28 × 40**
- **KOOPA SHELL hitbox = 28 × 24**

Inherited values from previous phases remain unchanged, including Mario movement, HUD, lives, timer, and coin rules.

---

## 8. OUT OF SCOPE

This contract does not add or describe:
- question blocks
- Mushroom
- Small Mario / Big Mario power-up states
- power-up growth or shrink behavior
- multiple levels
- checkpoint system
- pause system
- leaderboard
- backend features
- sound system

