import * as THREE from 'three'

export class CollisionDetector {
  checkSphereCollision(
    pos1: THREE.Vector3,
    radius1: number,
    pos2: THREE.Vector3,
    radius2: number
  ): boolean {
    const distance = pos1.distanceTo(pos2)
    return distance <= (radius1 + radius2)
  }

  checkBulletEnemyCollisions(bullets: any[], enemies: any[]): void {
    for (const bullet of bullets) {
      if (!bullet.active) continue

      for (const enemy of enemies) {
        if (!enemy.active) continue

        if (this.checkSphereCollision(bullet.getPosition(), 0.2, enemy.getPosition(), 1)) {
          bullet.active = false
          enemy.takeDamage(1)
          break
        }
      }
    }
  }

  checkPlayerEnemyCollisions(playerPos: THREE.Vector3, enemies: any[]): boolean {
    for (const enemy of enemies) {
      if (!enemy.active) continue

      if (this.checkSphereCollision(playerPos, 0.5, enemy.getPosition(), 1)) {
        return true
      }
    }
    return false
  }

  checkPlayerObstacleCollisions(playerPos: THREE.Vector3, obstacles: any[]): boolean {
    for (const obstacle of obstacles) {
      if (!obstacle.active) continue

      if (this.checkSphereCollision(playerPos, 0.5, obstacle.getPosition(), 1)) {
        return true
      }
    }
    return false
  }
}
