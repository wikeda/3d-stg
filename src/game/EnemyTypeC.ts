import * as THREE from 'three'
import { Enemy } from './Enemy'

export class EnemyTypeC extends Enemy {
  private trackingSpeed: number = 3
  private timeAlive: number = 0
  private initialX: number
  private zigzagAmplitude: number = 8
  private zigzagFrequency: number = 1.5

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    super(scene, position, 3)
    this.initialX = position.x
  }

  protected createMesh(): THREE.Mesh {
    const geometry = new THREE.DodecahedronGeometry(1)
    const material = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      flatShading: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    return mesh
  }

  update(deltaTime: number, playerPos: THREE.Vector3): void {
    this.timeAlive += deltaTime

    // Zigzag pattern combined with gentle player tracking
    const zigzagOffset = Math.sin(this.timeAlive * this.zigzagFrequency) * this.zigzagAmplitude
    const targetX = this.initialX + zigzagOffset + (playerPos.x - this.mesh.position.x) * 0.2

    // Slow tracking towards player Y position
    const targetY = playerPos.y

    this.mesh.position.x += (targetX - this.mesh.position.x) * this.trackingSpeed * deltaTime
    this.mesh.position.y += (targetY - this.mesh.position.y) * this.trackingSpeed * deltaTime * 0.5

    // Move forward
    this.mesh.position.z += this.speed * deltaTime

    if (this.mesh.position.z > 20) {
      this.active = false
    }

    this.mesh.rotation.x += deltaTime * 3
    this.mesh.rotation.y += deltaTime * 3
    this.mesh.rotation.z += deltaTime * 3
  }
}
