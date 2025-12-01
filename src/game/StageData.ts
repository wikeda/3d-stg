import * as THREE from 'three'
import { StageConfig, WavePattern } from '../types'

export const STAGE_DATA: StageConfig[] = [
  // Stage 1: Tutorial - Easy
  {
    stageNumber: 1,
    enemySpawnInterval: 2.5,
    obstacleSpawnInterval: 5.0,
    backgroundColor: 0x87CEEB, // Sky blue
    groundColors: { color1: '#00ff00', color2: '#00aa00' },
    waves: [
      {
        enemyType: 'A',
        positions: [
          new THREE.Vector3(0, 0, -100),
          new THREE.Vector3(-5, 2, -110),
          new THREE.Vector3(5, 2, -110)
        ],
        spawnDelay: 1.0
      }
    ]
  },

  // Stage 2: Moderate difficulty
  {
    stageNumber: 2,
    enemySpawnInterval: 2.0,
    obstacleSpawnInterval: 4.5,
    backgroundColor: 0xFF6347, // Tomato
    groundColors: { color1: '#ff8800', color2: '#cc6600' },
    waves: [
      {
        enemyType: 'B',
        positions: [
          new THREE.Vector3(-8, 0, -100),
          new THREE.Vector3(0, 3, -105),
          new THREE.Vector3(8, 0, -100)
        ],
        spawnDelay: 1.5
      }
    ]
  },

  // Stage 3: Increased difficulty
  {
    stageNumber: 3,
    enemySpawnInterval: 1.8,
    obstacleSpawnInterval: 4.0,
    backgroundColor: 0x9370DB, // Medium purple
    groundColors: { color1: '#ff00ff', color2: '#aa00aa' },
    waves: [
      {
        enemyType: 'C',
        positions: [
          new THREE.Vector3(-10, -2, -100),
          new THREE.Vector3(10, -2, -100),
          new THREE.Vector3(0, 5, -95)
        ],
        spawnDelay: 1.2
      }
    ]
  },

  // Stage 4: Hard
  {
    stageNumber: 4,
    enemySpawnInterval: 1.5,
    obstacleSpawnInterval: 3.5,
    backgroundColor: 0xFF1493, // Deep pink
    groundColors: { color1: '#ff0000', color2: '#aa0000' },
    waves: [
      {
        enemyType: 'A',
        positions: [
          new THREE.Vector3(-8, 0, -100),
          new THREE.Vector3(-4, 3, -105),
          new THREE.Vector3(0, -3, -100),
          new THREE.Vector3(4, 3, -105),
          new THREE.Vector3(8, 0, -100)
        ],
        spawnDelay: 1.0
      }
    ]
  },

  // Stage 5: Final stage - Very hard
  {
    stageNumber: 5,
    enemySpawnInterval: 1.2,
    obstacleSpawnInterval: 3.0,
    backgroundColor: 0x000080, // Navy
    groundColors: { color1: '#0000ff', color2: '#0000aa' },
    waves: [
      {
        enemyType: 'C',
        positions: [
          new THREE.Vector3(-10, 5, -100),
          new THREE.Vector3(-5, -5, -95),
          new THREE.Vector3(0, 0, -105),
          new THREE.Vector3(5, -5, -95),
          new THREE.Vector3(10, 5, -100)
        ],
        spawnDelay: 0.8
      }
    ]
  }
]

export function getStageConfig(stageNumber: number): StageConfig {
  const index = stageNumber - 1
  if (index >= 0 && index < STAGE_DATA.length) {
    return STAGE_DATA[index]
  }
  // Return last stage if beyond max
  return STAGE_DATA[STAGE_DATA.length - 1]
}
