// src/data/gameConfig.ts
// ALL numeric constants for the project. No hardcoded values elsewhere.

// Game dimensions
export const GAME_WIDTH = 800
export const GAME_HEIGHT = 400
export const GAME_BG_COLOR = '#5C94FC'

// Physics
export const PHYSICS_GRAVITY_Y = 800

// Player movement
export const PLAYER_MOVE_SPEED = 160
export const PLAYER_RUN_SPEED = 240
export const PLAYER_JUMP_VELOCITY = -500
export const PLAYER_MIN_JUMP_VELOCITY = -200
export const PLAYER_MAX_FALL_SPEED = 600

// FEEL PARAMETERS — MANDATORY FROM PH1
export const COYOTE_TIME_MS = 80
export const JUMP_BUFFER_MS = 100
export const STOMP_BOUNCE_VELOCITY = -300
export const INVINCIBILITY_MS = 2000

// Hitbox sizes (physics body — constitution 4.6)
export const MARIO_SMALL_W = 20
export const MARIO_SMALL_H = 26
export const MARIO_BIG_W = 20
export const MARIO_BIG_H = 44

// Display sizes (visual — proportional to 70px tiles)
export const MARIO_DISPLAY_SMALL_W = 30
export const MARIO_DISPLAY_SMALL_H = 42
export const MARIO_DISPLAY_BIG_W = 36
export const MARIO_DISPLAY_BIG_H = 56

// Enemies (used from PH3)
export const GOOMBA_SPEED = 60
export const KOOPA_SPEED_PATROL = 50
export const KOOPA_SPEED_SHELL = 300
export const GOOMBA_W = 28
export const GOOMBA_H = 24
export const KOOPA_W = 28
export const KOOPA_H = 40
export const KOOPA_SHELL_W = 28
export const KOOPA_SHELL_H = 24

// Collectibles and scoring
export const COIN_SCORE = 10
export const GOOMBA_STOMP_SCORE = 100
export const KOOPA_STOMP_SCORE = 150
export const KOOPA_SHELL_KILL_SCORE = 200
export const LEVEL_COMPLETE_SCORE = 500
export const ALL_COINS_BONUS = 300
export const LIFE_BONUS_SCORE = 500
export const MUSHROOM_SPEED = 80
export const COIN_W = 20
export const COIN_H = 20
export const MUSHROOM_W = 24
export const MUSHROOM_H = 24

// Display size for mushroom (visual — proportional to 70px tiles)
export const MUSHROOM_DISPLAY_W = 36
export const MUSHROOM_DISPLAY_H = 36

// Timer and lives
export const LEVEL_TIMER_START = 400
export const LIVES_START = 3

// Virtual D-pad
export const VIRTUAL_BTN_SIZE = 72
export const VIRTUAL_BTN_MARGIN = 20

// UI colors
export const UI_BG_COLOR = '#1A1A2E'
export const UI_TEXT_COLOR = '#FFFFFF'
export const UI_ACCENT_COLOR = '#FFD700'
export const DANGER_COLOR = '#E74C3C'
export const SUCCESS_COLOR = '#27AE60'

// Level backgrounds
export const SKY_COLOR = '#5C94FC'
export const CAVE_COLOR = '#1A1A2E'
export const CASTLE_COLOR = '#2C1810'

// Player start position
export const PLAYER_START_X = 100
export const PLAYER_START_Y = 300

// Tile size (Kenney platformer tiles)
export const TILE_SIZE = 70

// Death boundary offset below game world
export const DEATH_BOUNDARY_OFFSET = 100

// Camera dead zone
export const CAMERA_DEADZONE_WIDTH = 50
export const CAMERA_DEADZONE_HEIGHT = 50

// D-pad button gap
export const VIRTUAL_BTN_GAP = 8

// D-pad label font size
export const DPAD_LABEL_FONT_SIZE = 24

// Menu title font size
export const MENU_TITLE_FONT_SIZE = 48

// Menu button font size
export const MENU_BUTTON_FONT_SIZE = 32

// Menu button padding
export const MENU_BUTTON_PADDING_X = 40
export const MENU_BUTTON_PADDING_Y = 16
export const MENU_BUTTON_RADIUS = 12

// Virtual D-pad alpha
export const VIRTUAL_BTN_ALPHA = 0.6

// Virtual D-pad depth
export const VIRTUAL_BTN_DEPTH = 100
export const DPAD_LABEL_DEPTH = 101

// D-pad button colors
export const DPAD_ARROW_COLOR = 0xffffff
export const DPAD_JUMP_COLOR = 0xffff00

// Animation frame rates
export const ANIM_IDLE_FRAMERATE = 1
export const ANIM_WALK_FRAMERATE = 8
export const ANIM_WALK_REPEAT = -1
export const ANIM_JUMP_FRAMERATE = 1
export const ANIM_DIE_FRAMERATE = 1

// Menu layout
export const MENU_TITLE_X = GAME_WIDTH / 2
export const MENU_TITLE_Y = GAME_HEIGHT / 3
export const MENU_BUTTON_X = GAME_WIDTH / 2
export const MENU_BUTTON_Y = GAME_HEIGHT / 2 + MENU_BUTTON_FONT_SIZE
export const MENU_BUTTON_DEPTH = 1

// Death restart delay
export const DEATH_RESTART_DELAY_MS = 1500

// Full alpha for opaque elements
export const FULL_ALPHA = 1

// Half divisor for centering
export const CENTER_ORIGIN = 0.5

// Right alignment origin
export const RIGHT_ORIGIN = 1

// PH2 — HUD layout
export const HUD_FONT_SIZE = 16
export const HUD_PADDING = 16
export const HUD_DEPTH = 50
export const HUD_HEART_SPACING = 30
export const HUD_COINS_ICON_OFFSET = 8

// PH2 — Coin animation
export const ANIM_COIN_FRAMERATE = 8
export const ANIM_COIN_REPEAT = -1

// PH2 — Timer speed (units per second)
export const TIMER_SPEED = 1
export const TIMER_INTERVAL_MS = 1000
export const TIMER_DIGITS = 3

// PH2 — GameOver layout
export const GAMEOVER_TITLE_FONT_SIZE = 48
export const GAMEOVER_SCORE_FONT_SIZE = 24
export const GAMEOVER_TITLE_Y = GAME_HEIGHT / 3
export const GAMEOVER_SCORE_Y = GAME_HEIGHT / 2
export const GAMEOVER_BUTTON_OFFSET = 60
export const GAMEOVER_BUTTON_Y = GAMEOVER_SCORE_Y + GAMEOVER_BUTTON_OFFSET

// PH3 — Stomp detection
export const STOMP_THRESHOLD = 16

// PH3 — Enemy animation frame rates
export const ANIM_GOOMBA_WALK_FRAMERATE = 6
export const ANIM_GOOMBA_DEAD_FRAMERATE = 1
export const ANIM_KOOPA_WALK_FRAMERATE = 6
export const ANIM_KOOPA_SHELL_FRAMERATE = 1

// PH3 — Goomba death delay before disappearing (ms)
export const GOOMBA_DEATH_DELAY_MS = 500

// PH3 — Invincibility blink cycle (ms per toggle)
export const INVINCIBILITY_BLINK_CYCLE = 100
export const INVINCIBILITY_ALPHA_DIM = 0.3

// HUD initial emit delay (ms)
export const HUD_INIT_DELAY_MS = 50

// PH4 — QuestionBlock
export const QUESTION_BLOCK_W = 70
export const QUESTION_BLOCK_H = 70
export const BUMP_HEIGHT = 16
export const BUMP_DURATION_MS = 150

// PH4 — Mushroom emerge
export const MUSHROOM_EMERGE_HEIGHT = 30
export const MUSHROOM_EMERGE_DURATION_MS = 300

// PH4 — Level 1 layout (platform sections)
export const LEVEL_1_ID              = 1
export const LEVEL_1_WIDTH           = 6400
export const SINGLE_TILE             = 1
export const TILE_LAST_OFFSET        = 1
export const TILE_GROUND_SEC1_X      = 0
export const TILE_GROUND_SEC1_COUNT  = 8
export const TILE_GROUND_SEC2_START  = 10
export const TILE_GROUND_SEC2_COUNT  = 6
export const TILE_FLOAT_1_START      = 7
export const TILE_FLOAT_1_HEIGHT     = 3
export const TILE_FLOAT_1_COUNT      = 3
export const TILE_GROUND_SEC3_START  = 18
export const TILE_GROUND_SEC3_COUNT  = 5
export const TILE_FLOAT_2_START      = 16
export const TILE_FLOAT_2_HEIGHT     = 2
export const TILE_FLOAT_2_COUNT      = 2
export const TILE_GROUND_SEC4_START  = 25
export const TILE_GROUND_SEC4_COUNT  = 4
export const TILE_STAIR_1_COL        = 30
export const TILE_STAIR_2_COL        = 31
export const TILE_STAIR_3_COL        = 32
export const TILE_GROUND_FINAL_START = 34
export const TILE_GROUND_FINAL_COUNT = 10

// PH4 — Level 1 staircase heights (tile units)
export const STAIR_HEIGHT_1 = 1
export const STAIR_HEIGHT_2 = 2
export const STAIR_HEIGHT_3 = 3

// PH4 — Level 1 row offsets above ground
export const ROW_ABOVE_GROUND  = 1
export const ROW_QBLOCK_HEIGHT = 3

// PH4 — Level 1 enemy positions (tile column multipliers)
export const ENEMY_GOOMBA_1_COL = 5
export const ENEMY_GOOMBA_2_COL = 12
export const ENEMY_GOOMBA_3_COL = 20
export const ENEMY_KOOPA_1_COL  = 14
export const ENEMY_KOOPA_2_COL  = 37

// PH4 — Level 1 coin positions (tile column multipliers)
export const COIN_COL_1  = 3
export const COIN_COL_2  = 4
export const COIN_COL_3  = 5
export const COIN_COL_4  = 8
export const COIN_COL_5  = 11
export const COIN_COL_6  = 12
export const COIN_COL_7  = 13
export const COIN_COL_8  = 16
export const COIN_COL_9  = 17
export const COIN_COL_10 = 19
export const COIN_COL_11 = 20
export const COIN_COL_12 = 36
export const COIN_COL_13 = 37
export const COIN_COL_14 = 38

// PH4 — Level 1 question block positions (tile column multipliers)
export const QBLOCK_1_COL = 4
export const QBLOCK_2_COL = 12
export const QBLOCK_3_COL = 19
export const QBLOCK_4_COL = 36
export const QBLOCK_5_COL = 38

// PH4 — Invincibility blink phase modulo
export const BLINK_PHASE_MODULO = 2

// PH4 — Bump tween half-duration divisor
export const BUMP_HALF_DIVISOR = 2

// PH4 — Virtual D-pad half button size (for centering)
export const VIRTUAL_BTN_HALF = VIRTUAL_BTN_SIZE / 2

// Direction constants (Koopa, Goomba, Mushroom)
export const DIRECTION_LEFT  = -1
export const DIRECTION_RIGHT = 1
// PH4 — Block coin popup
export const BLOCK_COIN_RISE_HEIGHT = 50
export const BLOCK_COIN_DISPLAY_MS = 500

// PH5 — Level transition
export const LEVEL_TRANSITION_DELAY_MS = 1500
export const LEVEL_COUNT = 3
export const LAST_LEVEL_INDEX = 2

// PH5 — Checkpoint visual
export const CHECKPOINT_LINE_WIDTH = 4
export const CHECKPOINT_LINE_HEIGHT = 80
export const CHECKPOINT_COLOR_INACTIVE = 0x27ae60
export const CHECKPOINT_COLOR_ACTIVE = 0xffffff

// PH5 — Flagpole hitbox
export const FLAGPOLE_HITBOX_W = 40
export const FLAGPOLE_HITBOX_H = 120

// PH5 — Pause key
export const PAUSE_KEY = 'ESC'

// PH5 — LevelComplete / Win layout
export const SCENE_TITLE_FONT_SIZE = 40
export const SCENE_INFO_FONT_SIZE = 24
export const SCENE_BUTTON_FONT_SIZE = 28
export const SCENE_INFO_LINE_HEIGHT = 36
export const SCENE_BUTTON_DELAY_MS = 500

// PH5 — Level 2 layout constants
export const L2_ID = 2
export const L2_WIDTH = 8000

// PH5 — Level 3 layout constants
export const L3_ID = 3
export const L3_WIDTH = 9600

// PH5 — Level blueprint data (all numbers live here per constitution 4.1)
// Named-object format for type-safe field access (no numeric index literals)

// GroundSection: { startCol, count }
export const L1_GROUND_SECTIONS: readonly { startCol: number; count: number }[] = [
  { startCol: 0,  count: 12 }, { startCol: 14, count: 8  }, { startCol: 24, count: 10 },
  { startCol: 36, count: 6  }, { startCol: 44, count: 8  }, { startCol: 54, count: 6  },
  { startCol: 62, count: 8  }, { startCol: 72, count: 6  }, { startCol: 80, count: 12 }
]
// FloatSection: { startCol, heightAbove, count }
export const L1_FLOAT_SECTIONS: readonly { startCol: number; heightAbove: number; count: number }[] = [
  { startCol: 10, heightAbove: 3, count: 3 }, { startCol: 20, heightAbove: 2, count: 4 },
  { startCol: 34, heightAbove: 3, count: 2 }, { startCol: 40, heightAbove: 2, count: 3 },
  { startCol: 50, heightAbove: 3, count: 3 }, { startCol: 60, heightAbove: 2, count: 2 },
  { startCol: 68, heightAbove: 3, count: 3 }, { startCol: 78, heightAbove: 2, count: 2 }
]
// EnemyEntry: { type, col }
export const L1_ENEMY_COLS: readonly { type: string; col: number }[] = [
  { type: 'goomba', col: 6  }, { type: 'goomba', col: 17 },
  { type: 'goomba', col: 27 }, { type: 'goomba', col: 65 }
]
export const L1_COIN_COLS: readonly number[] = [
  3, 4, 5, 8, 9, 15, 16, 17, 25, 26,
  27, 28, 37, 38, 45, 55, 56, 63, 73, 74
]
// QBlockEntry: { col, content }
export const L1_QBLOCK_DATA: readonly { col: number; content: string }[] = [
  { col: 7,  content: 'coin'     }, { col: 16, content: 'mushroom' },
  { col: 26, content: 'coin'     }, { col: 46, content: 'coin'     },
  { col: 64, content: 'mushroom' }
]
export const L1_CHECKPOINT_COL = 44
export const L1_FLAG_COL = 88

export const L2_GROUND_SECTIONS: readonly { startCol: number; count: number }[] = [
  { startCol: 0,   count: 14 }, { startCol: 16,  count: 10 }, { startCol: 28,  count: 8  },
  { startCol: 38,  count: 12 }, { startCol: 52,  count: 6  }, { startCol: 60,  count: 10 },
  { startCol: 72,  count: 8  }, { startCol: 82,  count: 10 }, { startCol: 94,  count: 6  },
  { startCol: 102, count: 14 }
]
export const L2_FLOAT_SECTIONS: readonly { startCol: number; heightAbove: number; count: number }[] = [
  { startCol: 12,  heightAbove: 3, count: 3 }, { startCol: 24,  heightAbove: 2, count: 4 },
  { startCol: 36,  heightAbove: 3, count: 2 }, { startCol: 48,  heightAbove: 2, count: 3 },
  { startCol: 58,  heightAbove: 3, count: 3 }, { startCol: 68,  heightAbove: 2, count: 2 },
  { startCol: 80,  heightAbove: 3, count: 3 }, { startCol: 90,  heightAbove: 2, count: 4 },
  { startCol: 100, heightAbove: 3, count: 2 }
]
export const L2_ENEMY_COLS: readonly { type: string; col: number }[] = [
  { type: 'goomba', col: 8  }, { type: 'goomba', col: 30 }, { type: 'goomba', col: 63 },
  { type: 'koopa',  col: 18 }, { type: 'koopa',  col: 42 }, { type: 'koopa',  col: 85 }
]
export const L2_COIN_COLS: readonly number[] = [
  3, 4, 5, 6, 7, 17, 18, 19, 20, 29,
  30, 31, 39, 40, 41, 53, 54, 61, 62, 63,
  64, 73, 74, 75, 83, 84, 95, 96, 103, 104
]
export const L2_QBLOCK_DATA: readonly { col: number; content: string }[] = [
  { col: 6,  content: 'coin'     }, { col: 19, content: 'mushroom' },
  { col: 40, content: 'coin'     }, { col: 62, content: 'coin'     },
  { col: 74, content: 'mushroom' }, { col: 95, content: 'coin'     }
]
export const L2_CHECKPOINT_COL = 52
export const L2_FLAG_COL = 112

export const L3_GROUND_SECTIONS: readonly { startCol: number; count: number }[] = [
  { startCol: 0,   count: 16 }, { startCol: 18,  count: 8  }, { startCol: 28,  count: 12 },
  { startCol: 42,  count: 6  }, { startCol: 50,  count: 10 }, { startCol: 62,  count: 8  },
  { startCol: 72,  count: 6  }, { startCol: 80,  count: 12 }, { startCol: 94,  count: 8  },
  { startCol: 104, count: 10 }, { startCol: 116, count: 6  }, { startCol: 124, count: 14 }
]
export const L3_FLOAT_SECTIONS: readonly { startCol: number; heightAbove: number; count: number }[] = [
  { startCol: 14,  heightAbove: 3, count: 3 }, { startCol: 24,  heightAbove: 2, count: 4 },
  { startCol: 38,  heightAbove: 3, count: 2 }, { startCol: 48,  heightAbove: 2, count: 3 },
  { startCol: 58,  heightAbove: 3, count: 3 }, { startCol: 70,  heightAbove: 2, count: 2 },
  { startCol: 78,  heightAbove: 3, count: 3 }, { startCol: 90,  heightAbove: 2, count: 4 },
  { startCol: 102, heightAbove: 3, count: 2 }, { startCol: 112, heightAbove: 2, count: 3 },
  { startCol: 122, heightAbove: 3, count: 2 }
]
export const L3_ENEMY_COLS: readonly { type: string; col: number }[] = [
  { type: 'goomba', col: 10  }, { type: 'goomba', col: 32  },
  { type: 'goomba', col: 65  }, { type: 'goomba', col: 95  },
  { type: 'koopa',  col: 20  }, { type: 'koopa',  col: 44  },
  { type: 'koopa',  col: 82  }, { type: 'koopa',  col: 108 }
]
export const L3_COIN_COLS: readonly number[] = [
  3, 4, 5, 6, 7, 19, 20, 21, 30, 31,
  32, 43, 44, 51, 52, 63, 64, 81, 82, 95,
  96, 105, 106, 125, 126
]
export const L3_QBLOCK_DATA: readonly { col: number; content: string }[] = [
  { col: 5,   content: 'coin'     }, { col: 20,  content: 'mushroom' },
  { col: 31,  content: 'coin'     }, { col: 52,  content: 'mushroom' },
  { col: 64,  content: 'coin'     }, { col: 96,  content: 'coin'     },
  { col: 106, content: 'mushroom' }
]
export const L3_CHECKPOINT_COL = 62
export const L3_FLAG_COL = 134

// PH5 — Scene layout divisors
export const PAUSE_OVERLAY_ALPHA              = 0.8
export const SCENE_TITLE_Y_DIVISOR           = 3
export const WIN_TITLE_Y_DIVISOR             = 4
export const SCENE_LINE_OFFSET_2             = 2
export const SCENE_LINE_OFFSET_3             = 3
export const SCENE_LINE_OFFSET_5             = 5
export const NEXT_LEVEL_OFFSET               = 1

// PH5 — Checkpoint zone multipliers
export const CHECKPOINT_ZONE_WIDTH_MULTIPLIER = 4

// PH6 — Audio asset keys
export const AUDIO_KEY_COIN = 'coin'
export const AUDIO_KEY_JUMP = 'jump'
export const AUDIO_KEY_STOMP = 'stomp'
export const AUDIO_KEY_DIE = 'die'
export const AUDIO_KEY_MUSIC = 'music'

// PH6 — Audio paths (relative to public/)
export const AUDIO_PATH_COIN = 'assets/audio/coin.ogg'
export const AUDIO_PATH_JUMP = 'assets/audio/jump.ogg'
export const AUDIO_PATH_STOMP = 'assets/audio/stomp.ogg'
export const AUDIO_PATH_DIE = 'assets/audio/die.ogg'
export const AUDIO_PATH_MUSIC = 'assets/audio/music.ogg'

// PH6 — Music volume
export const MUSIC_VOLUME = 0.5

// PH6 — SoundManager registry key
export const SOUND_MANAGER_KEY = 'soundManager'

// PH6 — Leaderboard layout
export const LEADERBOARD_TITLE_FONT_SIZE = 36
export const LEADERBOARD_ENTRY_FONT_SIZE = 20
export const LEADERBOARD_ENTRY_LINE_HEIGHT = 30
export const LEADERBOARD_TOP_COUNT = 10
export const LEADERBOARD_TITLE_Y_OFFSET = 40
export const LEADERBOARD_LIST_START_Y = 90
export const LEADERBOARD_RANK_X = 150
export const LEADERBOARD_NAME_X = 220
export const LEADERBOARD_SCORE_X = 650
export const LEADERBOARD_BACK_BUTTON_Y = 370

// PH6 — WinScene submit layout
export const WIN_INPUT_WIDTH = 200
export const WIN_INPUT_HEIGHT = 32
export const WIN_INPUT_FONT_SIZE = 16
export const WIN_INPUT_MAX_LENGTH = 12
export const WIN_SUBMIT_BUTTON_Y_OFFSET = 7
export const WIN_LEADERBOARD_BUTTON_Y_OFFSET = 9

// PH6 — API fallback text
export const API_FALLBACK_TEXT = 'Could not connect to server'
export const API_LOADING_TEXT = 'Loading...'
export const SUBMIT_SUCCESS_TEXT = 'Score saved!'
export const SUBMIT_BUTTON_TEXT = 'SUBMIT'
export const SUBMITTING_TEXT = 'Submitting...'
export const LEADERBOARD_BUTTON_TEXT = 'LEADERBOARD'
export const BACK_TO_MENU_TEXT = 'BACK TO MENU'
export const PLAY_AGAIN_TEXT = 'PLAY AGAIN'

// PH6 — Menu leaderboard button offset
export const MENU_LEADERBOARD_BUTTON_OFFSET = 60

// PH6 — Win input background color
export const WIN_INPUT_BG_COLOR = '#222222'

// PH6 — Rank offset for zero-based index
export const RANK_INDEX_OFFSET = 1

// PH6 — Win input CSS styling values
export const WIN_INPUT_BORDER_WIDTH = 2
export const WIN_INPUT_BORDER_RADIUS = 4
