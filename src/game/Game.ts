import * as THREE from 'three'
import { SceneManager } from '../scene/SceneManager'
import { Background } from '../scene/Background'
import { InputManager } from '../input/InputManager'
import { Player } from './Player'
import { Bullet } from './Bullet'
import { Enemy } from './Enemy'
import { EnemyTypeA } from './EnemyTypeA'
import { EnemyTypeB } from './EnemyTypeB'
import { EnemyTypeC } from './EnemyTypeC'
import { Obstacle } from './Obstacle'
import { CollisionDetector } from '../utils/CollisionDetector'
import { HUD } from '../ui/HUD'
import { GameOverScreen } from '../ui/GameOverScreen'

export class Game {
  private sceneManager: SceneManager
  private inputManager: InputManager
  private player: Player
  private enemies: Enemy[] = []
  private bullets: Bullet[] = []
  private obstacles: Obstacle[] = []
  private background: Background
  private hud: HUD
  private gameOverScreen: GameOverScreen
  private collisionDetector: CollisionDetector
  private clock: THREE.Clock
  private gameState: 'playing' | 'gameover' = 'playing'
  private currentStage: number = 1
  private score: number = 0
  private maxBullets: number = 5

  // Enemy spawning
  private enemySpawnTimer: number = 0
  private enemySpawnInterval: number = 2.0 // seconds
  private obstacleSpawnTimer: number = 0
  private obstacleSpawnInterval: number = 4.0

  constructor() {
    this.sceneManager = new SceneManager()
    this.inputManager = new InputManager()
    this.collisionDetector = new CollisionDetector()
    this.clock = new THREE.Clock()
    this.background = new Background(this.sceneManager.getScene())
    this.player = new Player(this.sceneManager.getScene())
    this.hud = new HUD()
    this.gameOverScreen = new GameOverScreen(() => this.restart())

    this.hud.show()
    this.gameLoop()
  }

  private gameLoop = (): void => {
    requestAnimationFrame(this.gameLoop)

    const deltaTime = this.clock.getDelta()

    if (this.gameState === 'playing') {
      this.update(deltaTime)
    }

    this.sceneManager.render()
  }

  private update(deltaTime: number): void {
    // Update input
    const input = this.inputManager.getInputState()

    // Update player
    this.player.update(deltaTime, input)

    // Shooting
    if (input.shoot && this.player.canShoot() && this.bullets.length < this.maxBullets) {
      const bullet = new Bullet(this.sceneManager.getScene(), this.player.getPosition())
      this.bullets.push(bullet)
      this.player.resetShootCooldown()
    }

    // Update bullets
    for (const bullet of this.bullets) {
      bullet.update(deltaTime)
    }

    // Remove inactive bullets
    this.bullets = this.bullets.filter(bullet => {
      if (!bullet.active) {
        bullet.destroy(this.sceneManager.getScene())
        return false
      }
      return true
    })

    // Update enemies
    const playerPos = this.player.getPosition()
    for (const enemy of this.enemies) {
      enemy.update(deltaTime, playerPos)
    }

    // Remove inactive enemies
    this.enemies = this.enemies.filter(enemy => {
      if (!enemy.active) {
        enemy.destroy(this.sceneManager.getScene())
        this.score += 100 // Add score for destroyed enemy
        this.hud.updateScore(this.score)
        return false
      }
      return true
    })

    // Update obstacles
    for (const obstacle of this.obstacles) {
      obstacle.update(deltaTime)
    }

    // Remove inactive obstacles
    this.obstacles = this.obstacles.filter(obstacle => {
      if (!obstacle.active) {
        obstacle.destroy(this.sceneManager.getScene())
        return false
      }
      return true
    })

    // Update background
    this.background.update(deltaTime)

    // Collision detection
    this.collisionDetector.checkBulletEnemyCollisions(this.bullets, this.enemies)

    if (this.collisionDetector.checkPlayerEnemyCollisions(playerPos, this.enemies)) {
      const gameOver = this.player.takeDamage(1)
      this.hud.updateHP(this.player.getHP())
      if (gameOver) {
        this.handleGameOver()
      }
    }

    if (this.collisionDetector.checkPlayerObstacleCollisions(playerPos, this.obstacles)) {
      const gameOver = this.player.takeDamage(1)
      this.hud.updateHP(this.player.getHP())
      if (gameOver) {
        this.handleGameOver()
      }
    }

    // Spawn enemies
    this.enemySpawnTimer += deltaTime
    if (this.enemySpawnTimer >= this.enemySpawnInterval) {
      this.spawnEnemy()
      this.enemySpawnTimer = 0
    }

    // Spawn obstacles
    this.obstacleSpawnTimer += deltaTime
    if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
      this.spawnObstacle()
      this.obstacleSpawnTimer = 0
    }
  }

  private spawnEnemy(): void {
    const x = THREE.MathUtils.randFloat(-10, 10)
    const y = THREE.MathUtils.randFloat(-5, 5)
    const z = -100

    const enemyType = Math.floor(Math.random() * 3)
    let enemy: Enemy

    switch (enemyType) {
      case 0:
        enemy = new EnemyTypeA(this.sceneManager.getScene(), new THREE.Vector3(x, y, z))
        break
      case 1:
        enemy = new EnemyTypeB(this.sceneManager.getScene(), new THREE.Vector3(x, y, z))
        break
      case 2:
        enemy = new EnemyTypeC(this.sceneManager.getScene(), new THREE.Vector3(x, y, z))
        break
      default:
        enemy = new EnemyTypeA(this.sceneManager.getScene(), new THREE.Vector3(x, y, z))
    }

    this.enemies.push(enemy)
  }

  private spawnObstacle(): void {
    const x = THREE.MathUtils.randFloat(-10, 10)
    const y = THREE.MathUtils.randFloat(-3, 3)
    const z = -100
    const type = Math.random() > 0.5 ? 'rock' : 'pillar'

    const obstacle = new Obstacle(this.sceneManager.getScene(), new THREE.Vector3(x, y, z), type)
    this.obstacles.push(obstacle)
  }

  private handleGameOver(): void {
    this.gameState = 'gameover'
    this.gameOverScreen.show(this.score, this.currentStage)
  }

  private restart(): void {
    // Clear all entities
    for (const bullet of this.bullets) {
      bullet.destroy(this.sceneManager.getScene())
    }
    for (const enemy of this.enemies) {
      enemy.destroy(this.sceneManager.getScene())
    }
    for (const obstacle of this.obstacles) {
      obstacle.destroy(this.sceneManager.getScene())
    }

    this.bullets = []
    this.enemies = []
    this.obstacles = []

    // Reset player (recreate)
    this.player.getMesh().removeFromParent()
    this.player = new Player(this.sceneManager.getScene())

    // Reset game state
    this.score = 0
    this.currentStage = 1
    this.gameState = 'playing'
    this.enemySpawnTimer = 0
    this.obstacleSpawnTimer = 0

    // Update HUD
    this.hud.updateHP(this.player.getHP())
    this.hud.updateScore(this.score)
    this.hud.updateStage(this.currentStage)

    this.clock.getDelta() // Reset delta time
  }
}
