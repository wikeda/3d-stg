import * as THREE from 'three'
import { InputState } from '../input/InputManager'

export class Player {
  private mesh: THREE.Mesh
  private hp: number = 5
  private maxHp: number = 5
  private speed: number = 15
  private bounds = { x: 12, y: 8 }
  private invincible: boolean = false
  private invincibleTime: number = 0
  private shootCooldown: number = 0
  private shootInterval: number = 0.15 // seconds between shots

  constructor(scene: THREE.Scene) {
    this.mesh = this.createMesh()
    scene.add(this.mesh)
  }

  private createMesh(): THREE.Mesh {
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 3)
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      flatShading: true,
      transparent: true,
      opacity: 1
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = Math.PI / 2
    mesh.position.set(0, 0, 0)
    mesh.castShadow = true
    return mesh
  }

  update(deltaTime: number, input: InputState): void {
    // Movement
    if (input.moveX !== 0 || input.moveY !== 0) {
      const targetX = input.moveX * this.bounds.x
      const targetY = input.moveY * this.bounds.y

      this.mesh.position.x += (targetX - this.mesh.position.x) * this.speed * deltaTime
      this.mesh.position.y += (targetY - this.mesh.position.y) * this.speed * deltaTime
    }

    // Boundary limits
    this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -this.bounds.x, this.bounds.x)
    this.mesh.position.y = THREE.MathUtils.clamp(this.mesh.position.y, -this.bounds.y, this.bounds.y)

    // Invincibility update
    if (this.invincible) {
      this.invincibleTime -= deltaTime
      if (this.invincibleTime <= 0) {
        this.invincible = false
        const material = this.mesh.material as THREE.MeshStandardMaterial
        material.opacity = 1
      } else {
        // Blinking effect
        const material = this.mesh.material as THREE.MeshStandardMaterial
        material.opacity = Math.sin(this.invincibleTime * 20) * 0.5 + 0.5
      }
    }

    // Shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime
    }
  }

  canShoot(): boolean {
    return this.shootCooldown <= 0
  }

  resetShootCooldown(): void {
    this.shootCooldown = this.shootInterval
  }

  takeDamage(amount: number): boolean {
    if (this.invincible) return false

    this.hp -= amount
    if (this.hp <= 0) {
      this.hp = 0
      return true // Game over
    }

    // Start invincibility
    this.invincible = true
    this.invincibleTime = 2.0 // 2 seconds invincible

    return false
  }

  heal(amount: number): void {
    this.hp = Math.min(this.hp + amount, this.maxHp)
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position.clone()
  }

  getMesh(): THREE.Mesh {
    return this.mesh
  }

  getHP(): number {
    return this.hp
  }

  getMaxHP(): number {
    return this.maxHp
  }
}
