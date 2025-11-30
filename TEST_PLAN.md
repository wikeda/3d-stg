# テスト計画書

## 📋 目次
1. [テスト戦略](#テスト戦略)
2. [テスト環境](#テスト環境)
3. [単体テスト](#単体テスト)
4. [統合テスト](#統合テスト)
5. [E2Eテスト](#e2eテスト)
6. [パフォーマンステスト](#パフォーマンステスト)
7. [クロスブラウザテスト](#クロスブラウザテスト)
8. [モバイルテスト](#モバイルテスト)
9. [テストケース詳細](#テストケース詳細)
10. [バグ管理](#バグ管理)

---

## 🎯 テスト戦略

### テスト方針

本プロジェクトでは、**品質を確保しつつ開発速度を維持する**ため、以下のテスト戦略を採用する：

1. **段階的テスト実施**
   - フェーズ1（MVP）: 手動テスト中心、重要機能のみ自動化
   - フェーズ2以降: 自動テスト拡充

2. **テストピラミッド**
   ```
        /\
       /E2E\      ← 少数（重要なユーザーフロー）
      /------\
     /統合テスト\   ← 中程度（コンポーネント間）
    /----------\
   /  単体テスト  \  ← 多数（ロジック、計算）
   --------------
   ```

3. **優先度付け**
   - P0（必須）: ゲームプレイの核心機能
   - P1（高）: ユーザー体験に影響する機能
   - P2（中）: 追加機能
   - P3（低）: エッジケース

4. **テストタイミング**
   - 実装中: 単体テスト
   - 機能完成時: 統合テスト
   - フェーズ完成時: E2Eテスト、パフォーマンステスト
   - リリース前: 全テスト実施

---

## 🖥 テスト環境

### 開発環境セットアップ

#### テストフレームワーク

```bash
# Vitest（高速なVite用テストランナー）
npm install -D vitest @vitest/ui

# Testing Library（DOM操作テスト）
npm install -D @testing-library/dom @testing-library/user-event

# Playwright（E2Eテスト）
npm install -D @playwright/test
```

#### 設定ファイル

**vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
})
```

**playwright.config.ts**
```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### テスト対象環境

| 環境 | バージョン/デバイス |
|------|-------------------|
| **ブラウザ（デスクトップ）** | Chrome（最新）、Firefox（最新）、Safari（最新）、Edge（最新） |
| **モバイルブラウザ** | iOS Safari、Android Chrome |
| **解像度** | 1920x1080、1366x768、375x667（モバイル）、414x896（モバイル） |

---

## 🧪 単体テスト

### テスト対象

ロジックを含むクラス・関数を単体テスト対象とする。Three.jsの描画部分は除外。

### テスト項目

#### 1. InputManager

**ファイル**: `tests/unit/InputManager.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { InputManager } from '../../src/input/InputManager'

describe('InputManager', () => {
  let inputManager: InputManager

  beforeEach(() => {
    inputManager = new InputManager()
  })

  it('should initialize with no input', () => {
    const state = inputManager.getInputState()
    expect(state.moveX).toBe(0)
    expect(state.moveY).toBe(0)
    expect(state.shoot).toBe(false)
  })

  it('should detect arrow key input', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    window.dispatchEvent(event)

    const state = inputManager.getInputState()
    expect(state.moveX).toBe(1)
  })

  it('should detect WASD input', () => {
    const eventW = new KeyboardEvent('keydown', { key: 'w' })
    window.dispatchEvent(eventW)

    const state = inputManager.getInputState()
    expect(state.moveY).toBe(1)
  })

  it('should detect space key for shooting', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' })
    window.dispatchEvent(event)

    const state = inputManager.getInputState()
    expect(state.shoot).toBe(true)
  })

  it('should handle multiple keys simultaneously', () => {
    const eventRight = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    const eventUp = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    const eventSpace = new KeyboardEvent('keydown', { key: ' ' })

    window.dispatchEvent(eventRight)
    window.dispatchEvent(eventUp)
    window.dispatchEvent(eventSpace)

    const state = inputManager.getInputState()
    expect(state.moveX).toBe(1)
    expect(state.moveY).toBe(1)
    expect(state.shoot).toBe(true)
  })
})
```

#### 2. CollisionDetector

**ファイル**: `tests/unit/CollisionDetector.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { CollisionDetector } from '../../src/utils/CollisionDetector'
import * as THREE from 'three'

describe('CollisionDetector', () => {
  const detector = new CollisionDetector()

  it('should detect collision when objects overlap', () => {
    const pos1 = new THREE.Vector3(0, 0, 0)
    const pos2 = new THREE.Vector3(0.5, 0, 0)
    const radius1 = 1
    const radius2 = 1

    const result = detector.checkSphereCollision(pos1, radius1, pos2, radius2)
    expect(result).toBe(true)
  })

  it('should not detect collision when objects are apart', () => {
    const pos1 = new THREE.Vector3(0, 0, 0)
    const pos2 = new THREE.Vector3(5, 0, 0)
    const radius1 = 1
    const radius2 = 1

    const result = detector.checkSphereCollision(pos1, radius1, pos2, radius2)
    expect(result).toBe(false)
  })

  it('should detect collision at exact boundary', () => {
    const pos1 = new THREE.Vector3(0, 0, 0)
    const pos2 = new THREE.Vector3(2, 0, 0)
    const radius1 = 1
    const radius2 = 1

    const result = detector.checkSphereCollision(pos1, radius1, pos2, radius2)
    expect(result).toBe(true)
  })
})
```

#### 3. Player Logic

**ファイル**: `tests/unit/Player.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { Player } from '../../src/game/Player'

describe('Player', () => {
  it('should initialize with correct HP', () => {
    // Three.jsモック使用
    const player = createMockPlayer()
    expect(player.getHP()).toBe(5)
  })

  it('should take damage correctly', () => {
    const player = createMockPlayer()
    const gameOver = player.takeDamage(1)

    expect(player.getHP()).toBe(4)
    expect(gameOver).toBe(false)
  })

  it('should trigger game over when HP reaches 0', () => {
    const player = createMockPlayer()
    player.takeDamage(5)

    expect(player.getHP()).toBe(0)
  })

  it('should not take damage during invincibility', () => {
    const player = createMockPlayer()
    player.takeDamage(1) // HP: 4, 無敵開始

    const gameOver = player.takeDamage(1) // 無敵中
    expect(player.getHP()).toBe(4)
    expect(gameOver).toBe(false)
  })

  it('should heal but not exceed max HP', () => {
    const player = createMockPlayer()
    player.takeDamage(2) // HP: 3
    player.heal(1) // HP: 4
    expect(player.getHP()).toBe(4)

    player.heal(5) // HP should stay at 5
    expect(player.getHP()).toBe(5)
  })
})
```

#### 4. ScoreManager

**ファイル**: `tests/unit/ScoreManager.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { ScoreManager } from '../../src/utils/ScoreManager'

describe('ScoreManager', () => {
  let scoreManager: ScoreManager

  beforeEach(() => {
    scoreManager = new ScoreManager()
  })

  it('should start with 0 score', () => {
    expect(scoreManager.getScore()).toBe(0)
  })

  it('should add score for enemy defeat', () => {
    scoreManager.addEnemyScore('A')
    expect(scoreManager.getScore()).toBe(100)

    scoreManager.addEnemyScore('B')
    expect(scoreManager.getScore()).toBe(300) // 100 + 200
  })

  it('should add bonus for stage clear', () => {
    scoreManager.addStageBonus(1)
    expect(scoreManager.getScore()).toBe(1000)
  })

  it('should save and load high score', () => {
    scoreManager.addEnemyScore('A')
    scoreManager.saveHighScore()

    const newScoreManager = new ScoreManager()
    expect(newScoreManager.getHighScore()).toBe(100)
  })
})
```

#### 5. Enemy Movement Logic

**ファイル**: `tests/unit/Enemy.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import * as THREE from 'three'

describe('Enemy', () => {
  it('should move forward for Type A', () => {
    const enemy = createMockEnemyTypeA()
    const initialZ = enemy.getPosition().z

    enemy.update(0.1, new THREE.Vector3(0, 0, 0))

    expect(enemy.getPosition().z).toBeGreaterThan(initialZ)
  })

  it('should move in sine wave for Type B', () => {
    const enemy = createMockEnemyTypeB()
    const positions: number[] = []

    for (let i = 0; i < 10; i++) {
      enemy.update(0.1, new THREE.Vector3(0, 0, 0))
      positions.push(enemy.getPosition().x)
    }

    // X座標が振動していることを確認
    const hasPositive = positions.some(x => x > 0.1)
    const hasNegative = positions.some(x => x < -0.1)
    expect(hasPositive && hasNegative).toBe(true)
  })

  it('should take damage and be destroyed', () => {
    const enemy = createMockEnemyTypeA()

    const destroyed = enemy.takeDamage(1)
    expect(destroyed).toBe(true)
    expect(enemy.active).toBe(false)
  })
})
```

### カバレッジ目標

- **全体**: 70%以上
- **ロジック層**: 80%以上
- **ユーティリティ**: 90%以上

---

## 🔗 統合テスト

### テスト対象

複数のコンポーネントが連携する機能をテスト。

### テスト項目

#### 1. プレイヤー射撃システム

**テストシナリオ**: プレイヤーが弾を発射し、敵に当たる

```typescript
describe('Player Shooting Integration', () => {
  it('should create bullet when player shoots', () => {
    const game = createMockGame()
    const input = { moveX: 0, moveY: 0, shoot: true }

    game.update(0.1, input)

    expect(game.getBullets().length).toBeGreaterThan(0)
  })

  it('should not exceed max bullet count', () => {
    const game = createMockGame()
    const input = { moveX: 0, moveY: 0, shoot: true }

    for (let i = 0; i < 10; i++) {
      game.update(0.1, input)
    }

    expect(game.getBullets().length).toBeLessThanOrEqual(5)
  })

  it('should destroy enemy when bullet hits', () => {
    const game = createMockGame()
    game.spawnEnemy('A', new THREE.Vector3(0, 0, -10))

    // 弾発射
    const input = { moveX: 0, moveY: 0, shoot: true }
    game.update(0.1, input)

    // 弾が敵に到達するまで更新
    for (let i = 0; i < 100; i++) {
      game.update(0.1, { moveX: 0, moveY: 0, shoot: false })
    }

    expect(game.getEnemies().length).toBe(0)
  })
})
```

#### 2. 衝突判定システム

**テストシナリオ**: プレイヤーが敵に接触してダメージを受ける

```typescript
describe('Collision System Integration', () => {
  it('should damage player when colliding with enemy', () => {
    const game = createMockGame()
    const initialHP = game.getPlayer().getHP()

    // プレイヤーの位置に敵を配置
    game.spawnEnemy('A', game.getPlayer().getPosition())
    game.update(0.1, { moveX: 0, moveY: 0, shoot: false })

    expect(game.getPlayer().getHP()).toBe(initialHP - 1)
  })

  it('should damage player when colliding with obstacle', () => {
    const game = createMockGame()
    const initialHP = game.getPlayer().getHP()

    game.spawnObstacle(game.getPlayer().getPosition())
    game.update(0.1, { moveX: 0, moveY: 0, shoot: false })

    expect(game.getPlayer().getHP()).toBeLessThan(initialHP)
  })
})
```

#### 3. スコアシステム統合

```typescript
describe('Score System Integration', () => {
  it('should increase score when enemy is defeated', () => {
    const game = createMockGame()
    const initialScore = game.getScore()

    game.spawnEnemy('A', new THREE.Vector3(0, 0, -10))

    // 弾発射して敵を倒す
    game.update(0.1, { moveX: 0, moveY: 0, shoot: true })
    for (let i = 0; i < 100; i++) {
      game.update(0.1, { moveX: 0, moveY: 0, shoot: false })
    }

    expect(game.getScore()).toBeGreaterThan(initialScore)
  })
})
```

#### 4. ステージ遷移

```typescript
describe('Stage Transition Integration', () => {
  it('should transition to next stage when current stage is cleared', () => {
    const game = createMockGame()
    game.setStage(1)

    // すべての敵を倒す
    game.clearAllEnemies()
    game.update(0.1, { moveX: 0, moveY: 0, shoot: false })

    expect(game.getCurrentStage()).toBe(2)
  })

  it('should show stage clear screen', () => {
    const game = createMockGame()
    game.clearAllEnemies()
    game.update(0.1, { moveX: 0, moveY: 0, shoot: false })

    expect(game.getGameState()).toBe('stageclear')
  })
})
```

---

## 🎮 E2Eテスト

### テストツール: Playwright

### テスト項目

#### 1. ゲーム起動テスト

**ファイル**: `tests/e2e/game-launch.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test('should load game without errors', async ({ page }) => {
  await page.goto('/')

  // Canvasが表示されていることを確認
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  // エラーがないことを確認
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  await page.waitForTimeout(2000)
  expect(errors.length).toBe(0)
})
```

#### 2. タイトル画面からゲームスタート

```typescript
test('should start game from title screen', async ({ page }) => {
  await page.goto('/')

  // STARTボタンをクリック
  await page.click('button:has-text("START")')

  // HUDが表示されることを確認
  await expect(page.locator('#hud')).toBeVisible()
  await expect(page.locator('#hp-display')).toContainText('5')
})
```

#### 3. キーボード操作テスト

```typescript
test('should move player with keyboard', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("START")')

  // 右矢印キー押下
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(500)

  // プレイヤーが移動したことを確認（Three.jsの内部状態は取得できないため、視覚的確認が必要）
  // スクリーンショット比較など
})
```

#### 4. ゲームオーバーフロー

```typescript
test('should show game over when player loses all HP', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("START")')

  // デバッグモードでプレイヤーHPを0にする
  await page.evaluate(() => {
    (window as any).game.player.hp = 0
  })

  await page.waitForTimeout(500)

  // ゲームオーバー画面を確認
  await expect(page.locator('text=GAME OVER')).toBeVisible()
  await expect(page.locator('button:has-text("RETRY")')).toBeVisible()
})
```

#### 5. ステージクリア→次ステージ

```typescript
test('should proceed to next stage after clearing', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("START")')

  // デバッグモードで即座にクリア
  await page.evaluate(() => {
    (window as any).game.clearStage()
  })

  // ステージクリア画面
  await expect(page.locator('text=STAGE CLEAR')).toBeVisible()

  // 次へボタンをクリック
  await page.click('button:has-text("NEXT")')

  // ステージ2が開始
  await expect(page.locator('#stage-display')).toContainText('STAGE 2')
})
```

#### 6. モバイルタッチ操作

```typescript
test('should work with touch input on mobile', async ({ page }) => {
  // モバイルビューポート設定
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.click('button:has-text("START")')

  // タッチイベント送信
  await page.touchscreen.tap(200, 300)
  await page.waitForTimeout(500)

  // ゲームが動作していることを確認
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
})
```

---

## ⚡ パフォーマンステスト

### テスト目標

- **フレームレート**: 60fps（最低55fps）維持
- **初回ロード時間**: 5秒以内
- **メモリ使用量**: 200MB以下

### テスト項目

#### 1. フレームレート測定

**ツール**: Chrome DevTools Performance Profile

**手順**:
1. Chrome DevToolsを開く
2. Performanceタブでレコーディング開始
3. 1分間ゲームプレイ
4. レコーディング停止
5. FPSグラフを確認

**合格基準**:
- 平均FPS: 58以上
- 最低FPS: 50以上
- フレームドロップ: 5%未満

#### 2. ロード時間測定

```typescript
// tests/performance/load-time.spec.ts
test('should load within 5 seconds', async ({ page }) => {
  const startTime = Date.now()

  await page.goto('/')
  await page.waitForSelector('canvas')

  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(5000)
})
```

#### 3. メモリリーク検出

**手順**:
1. Chrome DevTools → Memory → Heap snapshot
2. スナップショット1を取得
3. 5分間ゲームプレイ
4. スナップショット2を取得
5. 差分を確認

**合格基準**:
- メモリ増加量: 50MB以下
- Detached DOM nodes: 10個以下

#### 4. 大量オブジェクトテスト

```typescript
test('should handle 50 enemies + 5 bullets without lag', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("START")')

  // 大量の敵を生成
  await page.evaluate(() => {
    for (let i = 0; i < 50; i++) {
      (window as any).game.spawnEnemy('A', randomPosition())
    }
  })

  // FPS測定
  const fps = await page.evaluate(() => {
    return (window as any).game.getFPS()
  })

  expect(fps).toBeGreaterThan(55)
})
```

---

## 🌐 クロスブラウザテスト

### テスト対象ブラウザ

| ブラウザ | バージョン | 優先度 |
|---------|----------|--------|
| Chrome | 最新 | P0 |
| Firefox | 最新 | P0 |
| Safari | 最新 | P1 |
| Edge | 最新 | P1 |

### テストチェックリスト

#### 各ブラウザで実施

- [ ] ゲームが起動する
- [ ] 描画が正しい（色、形状）
- [ ] キーボード操作が動作
- [ ] マウス操作が動作
- [ ] 音声が再生される
- [ ] パフォーマンスが十分（50fps以上）
- [ ] ゲームオーバーまで完走できる

### Playwrightでのクロスブラウザテスト

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
```

---

## 📱 モバイルテスト

### テスト対象デバイス

| デバイス | OS | 解像度 | 優先度 |
|---------|-----|--------|--------|
| iPhone 12 | iOS 15+ | 390x844 | P0 |
| iPhone SE | iOS 15+ | 375x667 | P1 |
| Galaxy S21 | Android 11+ | 360x800 | P0 |
| iPad | iOS 15+ | 768x1024 | P2 |

### テストチェックリスト

#### タッチ操作
- [ ] タッチで移動できる
- [ ] タッチで射撃できる
- [ ] マルチタッチ対応
- [ ] スワイプジェスチャー動作

#### パフォーマンス
- [ ] 30fps以上維持（モバイルは30fps目標）
- [ ] バッテリー消費が許容範囲
- [ ] 発熱が許容範囲

#### UI/UX
- [ ] ボタンが押しやすいサイズ
- [ ] 文字が読みやすい
- [ ] 横向き・縦向き両対応（横向き推奨）

### モバイルテストコード例

```typescript
test('should work on iPhone 12', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  // タッチ操作テスト
  await page.touchscreen.tap(195, 422)
  await page.waitForTimeout(1000)

  // ゲームが動作していることを確認
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
})
```

---

## 📊 テストケース詳細

### フェーズ1（MVP）テストケース

#### TC001: プレイヤー移動
| ID | 項目 | 入力 | 期待結果 | 優先度 |
|----|------|------|---------|--------|
| TC001-01 | 右移動 | 右矢印キー | プレイヤーが右に移動 | P0 |
| TC001-02 | 左移動 | 左矢印キー | プレイヤーが左に移動 | P0 |
| TC001-03 | 上移動 | 上矢印キー | プレイヤーが上に移動 | P0 |
| TC001-04 | 下移動 | 下矢印キー | プレイヤーが下に移動 | P0 |
| TC001-05 | 画面端制限 | 右矢印キー長押し | 画面外に出ない | P0 |
| TC001-06 | WASD操作 | W/A/S/Dキー | 矢印キーと同じ動作 | P1 |

#### TC002: 射撃
| ID | 項目 | 入力 | 期待結果 | 優先度 |
|----|------|------|---------|--------|
| TC002-01 | 弾発射 | スペースキー | 弾が発射される | P0 |
| TC002-02 | 連射 | スペース長押し | 連続で弾が発射 | P0 |
| TC002-03 | 最大弾数 | 連射 | 5発までしか同時に存在しない | P0 |
| TC002-04 | 弾の移動 | 発射後 | 弾が前方に移動 | P0 |

#### TC003: 敵
| ID | 項目 | 入力 | 期待結果 | 優先度 |
|----|------|------|---------|--------|
| TC003-01 | 敵出現 | ゲーム開始 | 敵が出現する | P0 |
| TC003-02 | 敵移動（A） | 時間経過 | 直線的に手前に来る | P0 |
| TC003-03 | 敵移動（B） | 時間経過 | 左右に揺れる | P0 |
| TC003-04 | 敵移動（C） | 時間経過 | プレイヤーを追う | P0 |
| TC003-05 | 敵撃破 | 弾を当てる | 敵が消える | P0 |
| TC003-06 | 耐久力（A） | 弾1発 | 撃破される | P0 |
| TC003-07 | 耐久力（B） | 弾2発 | 撃破される | P0 |
| TC003-08 | 耐久力（C） | 弾3発 | 撃破される | P0 |

#### TC004: 衝突判定
| ID | 項目 | 入力 | 期待結果 | 優先度 |
|----|------|------|---------|--------|
| TC004-01 | 弾と敵 | 弾が敵に接触 | 敵がダメージ | P0 |
| TC004-02 | プレイヤーと敵 | プレイヤーが敵に接触 | プレイヤーHP-1 | P0 |
| TC004-03 | プレイヤーと障害物 | プレイヤーが障害物に接触 | プレイヤーHP-1 | P0 |

#### TC005: HP・ゲームオーバー
| ID | 項目 | 入力 | 期待結果 | 優先度 |
|----|------|------|---------|--------|
| TC005-01 | 初期HP | ゲーム開始 | HP=5 | P0 |
| TC005-02 | ダメージ | 敵に接触 | HP-1 | P0 |
| TC005-03 | 無敵時間 | ダメージ後2秒 | ダメージ受けない | P1 |
| TC005-04 | ゲームオーバー | HP=0 | ゲームオーバー画面 | P0 |
| TC005-05 | リトライ | ゲームオーバー→RETRY | ゲーム再開 | P0 |

#### TC006: 背景
| ID | 項目 | 入力 | 期待結果 | 優先度 |
|----|------|------|---------|--------|
| TC006-01 | 地面表示 | ゲーム開始 | チェッカーボードが表示 | P1 |
| TC006-02 | 地面スクロール | 時間経過 | 地面が流れる | P1 |
| TC006-03 | 星空表示 | ゲーム開始 | 星が表示される | P2 |

#### TC007: UI
| ID | 項目 | 入力 | 期待結果 | 優先度 |
|----|------|------|---------|--------|
| TC007-01 | HP表示 | ゲーム中 | 現在HPが表示 | P0 |
| TC007-02 | ステージ表示 | ゲーム中 | ステージ番号表示 | P1 |
| TC007-03 | スコア枠 | ゲーム中 | スコア枠が表示（0） | P2 |

### フェーズ2以降のテストケース

詳細は各フェーズ開始時に追加。

---

## 🐛 バグ管理

### バグ報告テンプレート

```markdown
## バグ報告

**ID**: BUG-XXX
**タイトル**: 簡潔なバグの説明
**優先度**: P0 / P1 / P2 / P3
**発見フェーズ**: MVP / Phase2 / Phase3 / Phase4
**環境**: ブラウザ名、OS、デバイス

### 再現手順
1.
2.
3.

### 期待される動作

### 実際の動作

### スクリーンショット
（あれば）

### 追加情報
コンソールエラー、スタックトレースなど
```

### バグ優先度定義

| 優先度 | 定義 | 対応時期 |
|--------|------|---------|
| **P0** | ゲームがプレイ不可能、クリティカルなバグ | 即座に修正 |
| **P1** | ゲーム体験に大きく影響、頻発するバグ | 24時間以内 |
| **P2** | 一部機能に影響、回避可能なバグ | 次回リリース前 |
| **P3** | 軽微なバグ、エッジケース | 時間があれば修正 |

---

## 📅 テストスケジュール

### フェーズ1（MVP）

| 週 | テスト活動 |
|----|----------|
| 1-2週目 | 実装と並行して単体テスト作成 |
| 3週目 | 統合テスト実施 |
| 4週目 | E2Eテスト、パフォーマンステスト、バグ修正 |

### フェーズ2以降

各フェーズの最終週にテスト実施。

### リリース前

- 全テストケース実行
- クロスブラウザテスト
- モバイルテスト
- パフォーマンステスト
- 最終バグ修正

---

## ✅ 完了条件

### MVP完了条件

- [ ] 全P0テストケース合格
- [ ] 全P1テストケース80%以上合格
- [ ] 単体テストカバレッジ70%以上
- [ ] Chrome、Firefoxでの動作確認
- [ ] 致命的バグ（P0）0件

### 最終リリース完了条件

- [ ] 全テストケース合格
- [ ] クロスブラウザテスト完了
- [ ] モバイルテスト完了
- [ ] パフォーマンステスト合格（60fps維持）
- [ ] P0、P1バグ0件

---

**作成日**: 2025-11-30
**バージョン**: 1.0
