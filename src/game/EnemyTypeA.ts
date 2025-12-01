import * as THREE from 'three'
import { Enemy } from './Enemy'

export class EnemyTypeA extends Enemy {
  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    super(scene, position, 1)
  }

  protected createMesh(): THREE.Mesh {
    const geometry = new THREE.TetrahedronGeometry(0.8)
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      flatShading: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    return mesh
  }

  update(deltaTime: number, playerPos: THREE.Vector3): void {
    // Straight movement towards player
    this.mesh.position.z += this.speed * deltaTime

    if (this.mesh.position.z > 20) {
      this.active = false
    }

    this.mesh.rotation.y += deltaTime * 2
  }
}
