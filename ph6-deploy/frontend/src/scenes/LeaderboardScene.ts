// src/scenes/LeaderboardScene.ts
// PH6: Top-10 leaderboard from API — tech contract 4.6/4.7, 6.4

import Phaser from 'phaser'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  UI_BG_COLOR,
  UI_TEXT_COLOR,
  UI_ACCENT_COLOR,
  DANGER_COLOR,
  CENTER_ORIGIN,
  LEADERBOARD_TITLE_FONT_SIZE,
  LEADERBOARD_ENTRY_FONT_SIZE,
  LEADERBOARD_ENTRY_LINE_HEIGHT,
  LEADERBOARD_TITLE_Y_OFFSET,
  LEADERBOARD_LIST_START_Y,
  LEADERBOARD_RANK_X,
  LEADERBOARD_NAME_X,
  LEADERBOARD_SCORE_X,
  LEADERBOARD_BACK_BUTTON_Y,
  SCENE_BUTTON_FONT_SIZE,
  RANK_INDEX_OFFSET,
  API_LOADING_TEXT,
  API_FALLBACK_TEXT,
  BACK_TO_MENU_TEXT
} from '../data/gameConfig'

interface ScoreRow {
  rank: number
  name: string
  score: number
}

export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' })
  }

  create(): void {
    this.cameras.main.setBackgroundColor(UI_BG_COLOR)

    const centerX = GAME_WIDTH * CENTER_ORIGIN

    // Title
    this.add.text(
      centerX,
      LEADERBOARD_TITLE_Y_OFFSET,
      'LEADERBOARD',
      {
        fontSize: LEADERBOARD_TITLE_FONT_SIZE + 'px',
        color: UI_ACCENT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN)

    // Tech contract 4.6 step 2: render loading state
    const loadingText = this.add.text(
      centerX,
      GAME_HEIGHT * CENTER_ORIGIN,
      API_LOADING_TEXT,
      {
        fontSize: LEADERBOARD_ENTRY_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR
      }
    ).setOrigin(CENTER_ORIGIN)

    // Back to Menu button — tech contract 4.7 step 5: keep navigation available
    const backText = this.add.text(
      centerX,
      LEADERBOARD_BACK_BUTTON_Y,
      BACK_TO_MENU_TEXT,
      {
        fontSize: SCENE_BUTTON_FONT_SIZE + 'px',
        color: UI_TEXT_COLOR,
        fontStyle: 'bold'
      }
    ).setOrigin(CENTER_ORIGIN).setInteractive({ useHandCursor: true })

    backText.on('pointerover', () => { backText.setColor(UI_ACCENT_COLOR) })
    backText.on('pointerout', () => { backText.setColor(UI_TEXT_COLOR) })

    backText.on('pointerdown', () => {
      this.scene.start('MainMenuScene')
    })

    // Tech contract 4.6 step 3: GET /api/scores
    const apiUrl = import.meta.env.VITE_API_URL || ''

    if (!apiUrl) {
      loadingText.setText(API_FALLBACK_TEXT)
      loadingText.setColor(DANGER_COLOR)
      return
    }

    fetch(apiUrl + '/api/scores')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed')
        }
        return response.json()
      })
      .then((rows: ScoreRow[]) => {
        // Tech contract 4.6 step 4-6: render Top-10
        loadingText.destroy()

        // Column headers
        this.add.text(
          LEADERBOARD_RANK_X,
          LEADERBOARD_LIST_START_Y - LEADERBOARD_ENTRY_LINE_HEIGHT,
          '#',
          {
            fontSize: LEADERBOARD_ENTRY_FONT_SIZE + 'px',
            color: UI_ACCENT_COLOR,
            fontStyle: 'bold'
          }
        ).setOrigin(CENTER_ORIGIN)

        this.add.text(
          LEADERBOARD_NAME_X,
          LEADERBOARD_LIST_START_Y - LEADERBOARD_ENTRY_LINE_HEIGHT,
          'NAME',
          {
            fontSize: LEADERBOARD_ENTRY_FONT_SIZE + 'px',
            color: UI_ACCENT_COLOR,
            fontStyle: 'bold'
          }
        )

        this.add.text(
          LEADERBOARD_SCORE_X,
          LEADERBOARD_LIST_START_Y - LEADERBOARD_ENTRY_LINE_HEIGHT,
          'SCORE',
          {
            fontSize: LEADERBOARD_ENTRY_FONT_SIZE + 'px',
            color: UI_ACCENT_COLOR,
            fontStyle: 'bold'
          }
        ).setOrigin(CENTER_ORIGIN)

        rows.forEach((row) => {
          const rowY = LEADERBOARD_LIST_START_Y + (row.rank - RANK_INDEX_OFFSET) * LEADERBOARD_ENTRY_LINE_HEIGHT

          // Rank
          this.add.text(
            LEADERBOARD_RANK_X,
            rowY,
            row.rank.toString(),
            {
              fontSize: LEADERBOARD_ENTRY_FONT_SIZE + 'px',
              color: UI_TEXT_COLOR
            }
          ).setOrigin(CENTER_ORIGIN)

          // Name
          this.add.text(
            LEADERBOARD_NAME_X,
            rowY,
            row.name,
            {
              fontSize: LEADERBOARD_ENTRY_FONT_SIZE + 'px',
              color: UI_TEXT_COLOR
            }
          )

          // Score
          this.add.text(
            LEADERBOARD_SCORE_X,
            rowY,
            row.score.toString(),
            {
              fontSize: LEADERBOARD_ENTRY_FONT_SIZE + 'px',
              color: UI_ACCENT_COLOR
            }
          ).setOrigin(CENTER_ORIGIN)
        })
      })
      .catch(() => {
        // Tech contract 4.7: fallback on failure
        loadingText.setText(API_FALLBACK_TEXT)
        loadingText.setColor(DANGER_COLOR)
      })
  }

  shutdown(): void {
    this.input.keyboard?.removeAllKeys()
    this.input.removeAllListeners()
    this.time.removeAllEvents()
  }
}
