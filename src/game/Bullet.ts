import * as THREE from 'three'

export class Bullet {
  private mesh: THREE.Mesh
  private speed: number = 80
  private lifetime: number = 3.0
  private age: number = 0
  public active: boolean = true

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.mesh = this.createMesh()
    this.mesh.position.copy(position)
    scene.add(this.mesh)
  }

  private createMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.2, 8, 8)
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    return new THREE.Mesh(geometry, material)
  }

  update(deltaTime: number): void {
    this.mesh.position.z -= this.speed * deltaTime
    this.age += deltaTime

    if (this.age >= this.lifetime || this.mesh.position.z < -300) {
      this.active = false
    }
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
