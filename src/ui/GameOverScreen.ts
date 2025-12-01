export class GameOverScreen {
  private screen: HTMLElement
  private finalScoreElement: HTMLElement
  private finalStageElement: HTMLElement
  private retryButton: HTMLElement

  constructor(onRetry: () => void) {
    this.screen = document.getElementById('game-over-screen')!
    this.finalScoreElement = document.getElementById('final-score')!
    this.finalStageElement = document.getElementById('final-stage')!
    this.retryButton = document.getElementById('retry-button')!

    this.retryButton.addEventListener('click', () => {
      this.hide()
      onRetry()
    })
  }

  show(score: number, stage: number): void {
    this.finalScoreElement.textContent = score.toString()
    this.finalStageElement.textContent = stage.toString()
    this.screen.style.display = 'block'
  }

  hide(): void {
    this.screen.style.display = 'none'
  }
}
