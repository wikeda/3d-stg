import * as THREE from 'three'

export class Obstacle {
  private mesh: THREE.Mesh
  private speed: number = 20
  public active: boolean = true

  constructor(scene: THREE.Scene, position: THREE.Vector3, type: 'rock' | 'pillar' = 'rock') {
    this.mesh = this.createMesh(type)
    this.mesh.position.copy(position)
    scene.add(this.mesh)
  }

  private createMesh(type: 'rock' | 'pillar'): THREE.Mesh {
    let geometry: THREE.BufferGeometry

    if (type === 'rock') {
      geometry = new THREE.DodecahedronGeometry(1.5)
    } else {
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 6)
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      flatShading: true
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    return mesh
  }

  update(deltaTime: number): void {
    // Move forward
    this.mesh.position.z += this.speed * deltaTime

    if (this.mesh.position.z > 20) {
      this.active = false
    }

    // Slow rotation
    this.mesh.rotation.y += deltaTime * 0.5
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
