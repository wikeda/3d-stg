import * as THREE from 'three'

export interface WavePattern {
  enemyType: 'A' | 'B' | 'C'
  positions: THREE.Vector3[]
  spawnDelay: number
}

export interface StageConfig {
  stageNumber: number
  waves: WavePattern[]
  enemySpawnInterval: number
  obstacleSpawnInterval: number
  backgroundColor: number
  groundColors: { color1: string; color2: string }
  scoreNeededForClear: number
  gameSpeed: number // Speed multiplier (1.0 = normal)
  hasCeiling: boolean
  ceilingColors?: { color1: string; color2: string }
  enemiesCanShoot: boolean
}
