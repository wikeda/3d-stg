import * as THREE from 'three'

export class Background {
  private ground: THREE.Mesh
  private stars: THREE.Points
  private scrollSpeed: number = 0.5
  private groundCanvas: HTMLCanvasElement

  constructor(scene: THREE.Scene) {
    this.groundCanvas = document.createElement('canvas')
    this.ground = this.createGround('#00ff00', '#00aa00')
    this.stars = this.createStars()
    scene.add(this.ground, this.stars)
  }

  private createGround(color1: string = '#00ff00', color2: string = '#00aa00'): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(100, 500, 10, 50)

    // Create checkerboard texture
    this.groundCanvas.width = 256
    this.groundCanvas.height = 256
    const ctx = this.groundCanvas.getContext('2d')!
    const tileSize = 32

    for (let y = 0; y < 256; y += tileSize) {
      for (let x = 0; x < 256; x += tileSize) {
        ctx.fillStyle = ((x / tileSize) + (y / tileSize)) % 2 === 0 ? color1 : color2
        ctx.fillRect(x, y, tileSize, tileSize)
      }
    }

    const texture = new THREE.CanvasTexture(this.groundCanvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 25)

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide
    })

    const ground = new THREE.Mesh(geometry, material)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -5
    ground.position.z = -250
    ground.receiveShadow = true

    return ground
  }

  updateGroundColors(color1: string, color2: string): void {
    const ctx = this.groundCanvas.getContext('2d')!
    const tileSize = 32

    for (let y = 0; y < 256; y += tileSize) {
      for (let x = 0; x < 256; x += tileSize) {
        ctx.fillStyle = ((x / tileSize) + (y / tileSize)) % 2 === 0 ? color1 : color2
        ctx.fillRect(x, y, tileSize, tileSize)
      }
    }

    const material = this.ground.material as THREE.MeshStandardMaterial
    if (material.map) {
      material.map.needsUpdate = true
    }
  }

  private createStars(): THREE.Points {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []

    for (let i = 0; i < 1000; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloat(10, 50), // Changed from 0 to 10 to avoid ground clipping
        THREE.MathUtils.randFloatSpread(500)
      )
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })

    return new THREE.Points(geometry, material)
  }

  update(deltaTime: number): void {
    // Ground scrolling (positive to move towards player)
    const material = this.ground.material as THREE.MeshStandardMaterial
    if (material.map) {
      material.map.offset.y += this.scrollSpeed * deltaTime
    }
  }
}
