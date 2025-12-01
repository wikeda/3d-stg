export class StageClearScreen {
  private screen: HTMLElement

  constructor(onNext: () => void) {
    this.screen = this.createScreen()
    document.body.appendChild(this.screen)

    const nextButton = this.screen.querySelector('#next-stage-button') as HTMLElement
    nextButton.addEventListener('click', () => {
      this.hide()
      onNext()
    })
  }

  private createScreen(): HTMLElement {
    const screen = document.createElement('div')
    screen.id = 'stage-clear-screen'
    screen.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: white;
      background: rgba(0, 0, 0, 0.8);
      padding: 40px;
      border-radius: 10px;
      display: none;
      z-index: 100;
    `

    screen.innerHTML = `
      <h1 style="font-size: 48px; margin-bottom: 20px; color: #00ff00;">STAGE CLEAR!</h1>
      <p style="font-size: 24px; margin: 10px 0;">Stage: <span id="cleared-stage">1</span></p>
      <p style="font-size: 24px; margin: 10px 0;">Score: <span id="cleared-score">0</span></p>
      <p style="font-size: 20px; margin: 10px 0;">Stage Bonus: <span id="stage-bonus">1000</span></p>
      <button id="next-stage-button" style="
        margin-top: 20px;
        padding: 15px 30px;
        font-size: 20px;
        background: #00ff00;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
      ">NEXT STAGE</button>
    `

    return screen
  }

  show(stage: number, score: number, bonus: number): void {
    const clearedStage = this.screen.querySelector('#cleared-stage') as HTMLElement
    const clearedScore = this.screen.querySelector('#cleared-score') as HTMLElement
    const stageBonus = this.screen.querySelector('#stage-bonus') as HTMLElement
    const nextButton = this.screen.querySelector('#next-stage-button') as HTMLElement

    clearedStage.textContent = stage.toString()
    clearedScore.textContent = score.toString()
    stageBonus.textContent = bonus.toString()

    // Change button text for final stage
    if (stage >= 5) {
      nextButton.textContent = 'GAME COMPLETE!'
    } else {
      nextButton.textContent = 'NEXT STAGE'
    }

    this.screen.style.display = 'block'
  }

  hide(): void {
    this.screen.style.display = 'none'
  }
}
