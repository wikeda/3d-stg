export interface InputState {
  moveX: number  // -1 to 1
  moveY: number  // -1 to 1
  shoot: boolean
}

export class InputManager {
  private keys: Set<string> = new Set()
  private mousePos: { x: number; y: number } = { x: 0, y: 0 }
  private mouseDown: boolean = false
  private touchPos: { x: number; y: number } | null = null
  private inputMode: 'keyboard' | 'mouse' | 'touch' = 'keyboard'

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // Keyboard
    window.addEventListener('keydown', (e) => this.keys.add(e.key))
    window.addEventListener('keyup', (e) => this.keys.delete(e.key))

    // Mouse
    window.addEventListener('mousemove', (e) => {
      this.inputMode = 'mouse'
      this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1
    })
    window.addEventListener('mousedown', () => this.mouseDown = true)
    window.addEventListener('mouseup', () => this.mouseDown = false)

    // Touch
    window.addEventListener('touchstart', (e) => {
      this.inputMode = 'touch'
      const touch = e.touches[0]
      this.touchPos = {
        x: (touch.clientX / window.innerWidth) * 2 - 1,
        y: -(touch.clientY / window.innerHeight) * 2 + 1
      }
    })
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0]
      this.touchPos = {
        x: (touch.clientX / window.innerWidth) * 2 - 1,
        y: -(touch.clientY / window.innerHeight) * 2 + 1
      }
    })
    window.addEventListener('touchend', () => this.touchPos = null)
  }

  getInputState(): InputState {
    const state: InputState = { moveX: 0, moveY: 0, shoot: false }

    if (this.inputMode === 'keyboard') {
      if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A')) state.moveX -= 1
      if (this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D')) state.moveX += 1
      if (this.keys.has('ArrowUp') || this.keys.has('w') || this.keys.has('W')) state.moveY += 1
      if (this.keys.has('ArrowDown') || this.keys.has('s') || this.keys.has('S')) state.moveY -= 1
      if (this.keys.has(' ')) state.shoot = true
    } else if (this.inputMode === 'mouse') {
      state.moveX = this.mousePos.x
      state.moveY = this.mousePos.y
      state.shoot = this.mouseDown
    } else if (this.inputMode === 'touch' && this.touchPos) {
      state.moveX = this.touchPos.x
      state.moveY = this.touchPos.y
      state.shoot = true
    }

    return state
  }
}
