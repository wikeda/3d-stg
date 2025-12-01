export class ScoreManager {
  private score: number = 0
  private highScore: number = 0
  private readonly HIGHSCORE_KEY = '3d-stg-highscore'

  constructor() {
    this.loadHighScore()
  }

  addEnemyScore(enemyType: 'A' | 'B' | 'C'): void {
    const scores = {
      'A': 100,
      'B': 200,
      'C': 300
    }
    this.score += scores[enemyType]
  }

  addStageBonus(stage: number): void {
    this.score += stage * 1000
  }

  getScore(): number {
    return this.score
  }

  getHighScore(): number {
    return this.highScore
  }

  saveHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem(this.HIGHSCORE_KEY, this.highScore.toString())
    }
  }

  private loadHighScore(): void {
    const saved = localStorage.getItem(this.HIGHSCORE_KEY)
    if (saved) {
      this.highScore = parseInt(saved, 10)
    }
  }

  reset(): void {
    this.score = 0
  }
}
