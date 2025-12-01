import * as THREE from 'three'
import { Enemy } from './Enemy'

export class EnemyTypeB extends Enemy {
  private timeAlive: number = 0

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    super(scene, position, 2)
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

  update(deltaTime: number, playerPos: THREE.Vector3): void {
    this.timeAlive += deltaTime

    // Sine wave movement (left-right)
    const amplitude = 5
    const frequency = 2
    this.mesh.position.x = Math.sin(this.timeAlive * frequency) * amplitude

    // Move forward
    this.mesh.position.z += this.speed * deltaTime

    if (this.mesh.position.z > 20) {
      this.active = false
    }

    this.mesh.rotation.x += deltaTime * 2
    this.mesh.rotation.y += deltaTime * 2
  }
}
