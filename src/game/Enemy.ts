import * as THREE from 'three'

export abstract class Enemy {
  protected mesh: THREE.Mesh
  protected hp: number
  protected maxHp: number
  protected speed: number = 20
  protected gameSpeed: number = 1.0
  protected canShoot: boolean = false
  public active: boolean = true

  constructor(scene: THREE.Scene, position: THREE.Vector3, hp: number, gameSpeed: number = 1.0) {
    this.hp = hp
    this.maxHp = hp
    this.gameSpeed = gameSpeed
    this.mesh = this.createMesh()
    this.mesh.position.copy(position)
    scene.add(this.mesh)
  }

  protected abstract createMesh(): THREE.Mesh

  abstract update(deltaTime: number, playerPos: THREE.Vector3): void

  takeDamage(amount: number): boolean {
    this.hp -= amount
    if (this.hp <= 0) {
      this.active = false
      return true // Destroyed
    }
    return false
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position.clone()
  }

  getMesh(): THREE.Mesh {
    return this.mesh
  }

  destroy(scene: THREE.Scene): void {
    scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    const material = this.mesh.material
    if (material instanceof THREE.Material) {
      material.dispose()
    }
  }
}
