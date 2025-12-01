import * as THREE from 'three'
import { StageConfig, WavePattern } from '../types'

export const STAGE_DATA: StageConfig[] = [
  // Stage 1: Tutorial - Easy (1200 points to clear)
  {
    stageNumber: 1,
    enemySpawnInterval: 2.5,
    obstacleSpawnInterval: 5.0,
    backgroundColor: 0x87CEEB,
    groundColors: { color1: '#00ff00', color2: '#00aa00' },
    scoreNeededForClear: 1200,
    gameSpeed: 1.0,
    hasCeiling: false,
    enemiesCanShoot: false,
    waves: []
  },

  // Stage 2: Speed up, enemies shoot (2400 points to clear)
  {
    stageNumber: 2,
    enemySpawnInterval: 2.0,
    obstacleSpawnInterval: 4.5,
    backgroundColor: 0xFF6347,
    groundColors: { color1: '#ff8800', color2: '#cc6600' },
    scoreNeededForClear: 2400,
    gameSpeed: 1.3,
    hasCeiling: false,
    enemiesCanShoot: true,
    waves: []
  },

  // Stage 3: Faster, ceiling scroll, more obstacles (3600 points to clear)
  {
    stageNumber: 3,
    enemySpawnInterval: 1.8,
    obstacleSpawnInterval: 3.0,
    backgroundColor: 0x9370DB,
    groundColors: { color1: '#ff00ff', color2: '#aa00aa' },
    ceilingColors: { color1: '#0000ff', color2: '#0000aa' },
    scoreNeededForClear: 3600,
    gameSpeed: 1.6,
    hasCeiling: true,
    enemiesCanShoot: true,
    waves: []
  },

  // Stage 4: Normal speed, mid-boss (5000 points to clear)
  {
    stageNumber: 4,
    enemySpawnInterval: 2.5,
    obstacleSpawnInterval: 4.0,
    backgroundColor: 0xFF1493,
    groundColors: { color1: '#ff0000', color2: '#aa0000' },
    scoreNeededForClear: 5000,
    gameSpeed: 1.0,
    hasCeiling: false,
    enemiesCanShoot: false,
    waves: []
  },

  // Stage 5: Fastest, ceiling, snake boss, many obstacles
  {
    stageNumber: 5,
    enemySpawnInterval: 1.2,
    obstacleSpawnInterval: 2.5,
    backgroundColor: 0x000080,
    groundColors: { color1: '#0000ff', color2: '#0000aa' },
    ceilingColors: { color1: '#ffff00', color2: '#aaaa00' },
    scoreNeededForClear: 8000,
    gameSpeed: 2.0,
    hasCeiling: true,
    enemiesCanShoot: true,
    waves: []
  }
]

export function getStageConfig(stageNumber: number): StageConfig {
  const index = stageNumber - 1
  if (index >= 0 && index < STAGE_DATA.length) {
    return STAGE_DATA[index]
  }
  return STAGE_DATA[STAGE_DATA.length - 1]
}
