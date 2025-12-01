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
}
