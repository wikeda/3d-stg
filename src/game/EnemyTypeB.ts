import * as THREE from 'three'
import { Enemy } from './Enemy'

export class EnemyTypeB extends Enemy {
  private timeAlive: number = 0
  private hasShot: boolean = false
  private shootZPosition: number = -30 // Shoot when reaching this Z position

  constructor(scene: THREE.Scene, position: THREE.Vector3, gameSpeed: number = 1.0) {
    super(scene, position, 2, gameSpeed)
  }

  protected createMesh(): THREE.Mesh {
    const geometry = new THREE.OctahedronGeometry(0.9)
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      flatShading: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    return mesh
  }

  shouldShootNow(): boolean {
    // Shoot once when reaching the shoot position
    if (!this.hasShot && this.mesh.position.z >= this.shootZPosition && this.canShoot) {
      this.hasShot = true
      return true
    }
    return false
  }

  update(deltaTime: number, playerPos: THREE.Vector3): void {
    this.timeAlive += deltaTime

    // Sine wave movement (left-right)
    const amplitude = 5
    const frequency = 2
    this.mesh.position.x = Math.sin(this.timeAlive * frequency) * amplitude

    // Move forward
    this.mesh.position.z += this.speed * this.gameSpeed * deltaTime

    if (this.mesh.position.z > 20) {
      this.active = false
    }

    this.mesh.rotation.x += deltaTime * 2
    this.mesh.rotation.y += deltaTime * 2

  }
}
