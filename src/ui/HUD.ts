export class HUD {
  private hpDisplay: HTMLElement
  private stageDisplay: HTMLElement
  private scoreDisplay: HTMLElement

  constructor() {
    this.hpDisplay = document.getElementById('hp-display')!
    this.stageDisplay = document.getElementById('stage-display')!
    this.scoreDisplay = document.getElementById('score-display')!
  }

  updateHP(hp: number): void {
    this.hpDisplay.textContent = `HP: ${hp}`
  }

  updateStage(stage: number): void {
    this.stageDisplay.textContent = `STAGE ${stage}`
  }

  updateScore(score: number): void {
    this.scoreDisplay.textContent = `SCORE: ${score}`
  }

  show(): void {
    const hud = document.getElementById('hud')
    if (hud) {
      hud.style.display = 'block'
    }
  }

  hide(): void {
    const hud = document.getElementById('hud')
    if (hud) {
      hud.style.display = 'none'
    }
  }
}
