import * as THREE from 'three'

export class EnemyBullet {
  private mesh: THREE.Mesh
  private velocity: THREE.Vector3
  private speed: number = 10
  private lifetime: number = 5.0
  private age: number = 0
  public active: boolean = true

  constructor(scene: THREE.Scene, position: THREE.Vector3, direction: THREE.Vector3) {
    this.mesh = this.createMesh()
    this.mesh.position.copy(position)
    this.velocity = direction.normalize().multiplyScalar(this.speed)
    scene.add(this.mesh)
  }

  private createMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(1.5, 16, 16)
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    return mesh
  }

  update(deltaTime: number): void {
    this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime))
    this.age += deltaTime

    if (this.age >= this.lifetime || 
        this.mesh.position.z > 20 ||
        this.mesh.position.z < -150 ||
        Math.abs(this.mesh.position.x) > 50 ||
        Math.abs(this.mesh.position.y) > 50) {
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
