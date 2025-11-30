# 実装計画書

## 📋 目次
1. [プロジェクトセットアップ](#プロジェクトセットアップ)
2. [アーキテクチャ設計](#アーキテクチャ設計)
3. [フェーズ別実装計画](#フェーズ別実装計画)
4. [クラス設計詳細](#クラス設計詳細)
5. [データフロー](#データフロー)
6. [技術的実装詳細](#技術的実装詳細)
7. [パフォーマンス最適化](#パフォーマンス最適化)
8. [デプロイメント](#デプロイメント)

---

## 🚀 プロジェクトセットアップ

### 1. 環境構築

#### 必要な依存関係
```json
{
  "dependencies": {
    "three": "^0.160.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@types/three": "^0.160.0"
  }
}
```

#### 初期セットアップコマンド
```bash
# プロジェクト初期化
npm init -y
npm install three
npm install -D typescript vite @types/three

# TypeScript設定
npx tsc --init

# ディレクトリ構造作成
mkdir -p src/{game,scene,ui,input,audio,utils,types}
mkdir -p public/assets/{audio,models}
```

### 2. 設定ファイル

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/3d-stg/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

#### package.json スクリプト
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 3. HTMLテンプレート（index.html）
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Harrier Style 3D Shooter</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      overflow: hidden;
      font-family: 'Arial', sans-serif;
    }
    #game-container {
      width: 100vw;
      height: 100vh;
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

---

## 🏗 アーキテクチャ設計

### システムアーキテクチャ図

```
┌─────────────────────────────────────────────────┐
│                   main.ts                        │
│            (エントリーポイント)                    │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│                 Game.ts                          │
│          (ゲームメインループ)                      │
├─────────────────────────────────────────────────┤
│ - init()                                         │
│ - update(deltaTime)                              │
│ - render()                                       │
│ - gameLoop()                                     │
└───┬─────────┬─────────┬─────────┬───────────┬───┘
    │         │         │         │           │
    ▼         ▼         ▼         ▼           ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌───────┐ ┌──────────┐
│Scene   │ │Input │ │UI    │ │Audio  │ │Collision │
│Manager │ │Mgr   │ │Mgr   │ │Manager│ │Detector  │
└───┬────┘ └──────┘ └──────┘ └───────┘ └──────────┘
    │
    ├─► Player
    ├─► Enemy[] (TypeA, TypeB, TypeC)
    ├─► Bullet[]
    ├─► Obstacle[]
    ├─► Background
    └─► Boss (フェーズ3)
```

### コンポーネント責務

| コンポーネント | 責務 |
|--------------|------|
| **Game** | ゲームループ、状態管理、各マネージャーの統括 |
| **SceneManager** | Three.jsシーン、カメラ、レンダラー管理 |
| **InputManager** | キーボード、マウス、タッチ入力の統一処理 |
| **Player** | プレイヤーの移動、射撃、状態管理 |
| **Enemy** | 敵の移動、攻撃、HP管理（基底クラス） |
| **Bullet** | 弾の移動、寿命管理 |
| **Background** | 背景のスクロール、描画 |
| **CollisionDetector** | オブジェクト間の衝突判定 |
| **HUD** | HP、スコア、ステージ番号の表示 |
| **AudioManager** | 効果音、BGMの再生管理 |

---

## 📅 フェーズ別実装計画

### フェーズ1: MVP（最小実装）

#### ステップ1: プロジェクトセットアップ（1日）
- [x] npm環境構築
- [x] TypeScript設定
- [x] Vite設定
- [x] ディレクトリ構造作成
- [x] 基本HTMLテンプレート作成

#### ステップ2: 基本シーン構築（2日）
**実装ファイル:**
- `src/scene/SceneManager.ts`
- `src/scene/Camera.ts`
- `src/main.ts`

**タスク:**
1. Three.jsシーン初期化
2. パースペクティブカメラ設定
   - FOV: 75度
   - アスペクト比: window.innerWidth / innerHeight
   - カメラ位置: (0, 5, 10)
   - カメラ視点: (0, 0, -50)
3. WebGLレンダラー作成
4. ライト設定（DirectionalLight, AmbientLight）
5. リサイズ対応

**コード例:**
```typescript
// src/scene/SceneManager.ts
import * as THREE from 'three'

export class SceneManager {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = this.createCamera()
    this.renderer = this.createRenderer()
    this.setupLights()
    this.handleResize()
  }

  private createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, -50)
    return camera
  }

  private createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.getElementById('game-container')?.appendChild(renderer.domElement)
    return renderer
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 10)
    this.scene.add(ambientLight, directionalLight)
  }

  private handleResize(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  getScene(): THREE.Scene { return this.scene }
  getCamera(): THREE.PerspectiveCamera { return this.camera }
  getRenderer(): THREE.WebGLRenderer { return this.renderer }
}
```

#### ステップ3: 背景実装（2日）
**実装ファイル:**
- `src/scene/Background.ts`

**タスク:**
1. チェッカーボード地面作成
   - PlaneGeometry使用
   - カスタムシェーダーまたはテクスチャで市松模様
   - サイズ: 100x500（幅x奥行き）
2. 星空実装
   - 背景色グラデーション
   - Points（星）をランダム配置
3. スクロールアニメーション
   - 地面のUVオフセット更新

**コード例:**
```typescript
// src/scene/Background.ts
import * as THREE from 'three'

export class Background {
  private ground: THREE.Mesh
  private stars: THREE.Points
  private scrollSpeed: number = 0.5

  constructor(scene: THREE.Scene) {
    this.ground = this.createGround()
    this.stars = this.createStars()
    scene.add(this.ground, this.stars)
  }

  private createGround(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(100, 500, 10, 50)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: false,
      side: THREE.DoubleSide
    })

    // チェッカーボードテクスチャ作成
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const tileSize = 32

    for (let y = 0; y < 256; y += tileSize) {
      for (let x = 0; x < 256; x += tileSize) {
        ctx.fillStyle = ((x / tileSize) + (y / tileSize)) % 2 === 0 ? '#00ff00' : '#00aa00'
        ctx.fillRect(x, y, tileSize, tileSize)
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 25)

    material.map = texture
    material.wireframe = false

    const ground = new THREE.Mesh(geometry, material)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -5
    ground.position.z = -250

    return ground
  }

  private createStars(): THREE.Points {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []

    for (let i = 0; i < 1000; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloat(0, 50),
        THREE.MathUtils.randFloatSpread(500)
      )
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })

    return new THREE.Points(geometry, material)
  }

  update(deltaTime: number): void {
    // 地面スクロール
    if (this.ground.material instanceof THREE.MeshBasicMaterial && this.ground.material.map) {
      this.ground.material.map.offset.y -= this.scrollSpeed * deltaTime
    }
  }
}
```

#### ステップ4: 入力管理（2日）
**実装ファイル:**
- `src/input/InputManager.ts`

**タスク:**
1. キーボード入力検出（WASD、矢印キー、スペース）
2. マウス入力検出（移動、クリック）
3. タッチ入力検出（タッチ座標、タップ）
4. 統一されたInput状態管理

**コード例:**
```typescript
// src/input/InputManager.ts
export interface InputState {
  moveX: number  // -1 to 1
  moveY: number  // -1 to 1
  shoot: boolean
}

export class InputManager {
  private keys: Set<string> = new Set()
  private mousePos: { x: number; y: number } = { x: 0, y: 0 }
  private mouseDown: boolean = false
  private touchPos: { x: number; y: number } | null = null
  private inputMode: 'keyboard' | 'mouse' | 'touch' = 'keyboard'

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // キーボード
    window.addEventListener('keydown', (e) => this.keys.add(e.key))
    window.addEventListener('keyup', (e) => this.keys.delete(e.key))

    // マウス
    window.addEventListener('mousemove', (e) => {
      this.inputMode = 'mouse'
      this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1
    })
    window.addEventListener('mousedown', () => this.mouseDown = true)
    window.addEventListener('mouseup', () => this.mouseDown = false)

    // タッチ
    window.addEventListener('touchstart', (e) => {
      this.inputMode = 'touch'
      const touch = e.touches[0]
      this.touchPos = {
        x: (touch.clientX / window.innerWidth) * 2 - 1,
        y: -(touch.clientY / window.innerHeight) * 2 + 1
      }
    })
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0]
      this.touchPos = {
        x: (touch.clientX / window.innerWidth) * 2 - 1,
        y: -(touch.clientY / window.innerHeight) * 2 + 1
      }
    })
    window.addEventListener('touchend', () => this.touchPos = null)
  }

  getInputState(): InputState {
    const state: InputState = { moveX: 0, moveY: 0, shoot: false }

    if (this.inputMode === 'keyboard') {
      if (this.keys.has('ArrowLeft') || this.keys.has('a')) state.moveX -= 1
      if (this.keys.has('ArrowRight') || this.keys.has('d')) state.moveX += 1
      if (this.keys.has('ArrowUp') || this.keys.has('w')) state.moveY += 1
      if (this.keys.has('ArrowDown') || this.keys.has('s')) state.moveY -= 1
      if (this.keys.has(' ')) state.shoot = true
    } else if (this.inputMode === 'mouse') {
      state.moveX = this.mousePos.x
      state.moveY = this.mousePos.y
      state.shoot = this.mouseDown
    } else if (this.inputMode === 'touch' && this.touchPos) {
      state.moveX = this.touchPos.x
      state.moveY = this.touchPos.y
      state.shoot = true
    }

    return state
  }
}
```

#### ステップ5: プレイヤー実装（3日）
**実装ファイル:**
- `src/game/Player.ts`

**タスク:**
1. プレイヤーメッシュ作成（ローポリゴン、円錐または簡単な形状）
2. 移動制御（画面範囲内に制限）
3. HP管理（初期値5）
4. ダメージ処理
5. 無敵時間実装

**コード例:**
```typescript
// src/game/Player.ts
import * as THREE from 'three'
import { InputState } from '../input/InputManager'

export class Player {
  private mesh: THREE.Mesh
  private hp: number = 5
  private maxHp: number = 5
  private speed: number = 15
  private bounds = { x: 12, y: 8 }
  private invincible: boolean = false
  private invincibleTime: number = 0

  constructor(scene: THREE.Scene) {
    this.mesh = this.createMesh()
    scene.add(this.mesh)
  }

  private createMesh(): THREE.Mesh {
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 3)
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      flatShading: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = Math.PI / 2
    mesh.position.set(0, 0, 0)
    return mesh
  }

  update(deltaTime: number, input: InputState): void {
    // 移動
    if (input.moveX !== 0 || input.moveY !== 0) {
      const targetX = input.moveX * this.bounds.x
      const targetY = input.moveY * this.bounds.y

      this.mesh.position.x += (targetX - this.mesh.position.x) * this.speed * deltaTime
      this.mesh.position.y += (targetY - this.mesh.position.y) * this.speed * deltaTime
    }

    // 画面範囲制限
    this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -this.bounds.x, this.bounds.x)
    this.mesh.position.y = THREE.MathUtils.clamp(this.mesh.position.y, -this.bounds.y, this.bounds.y)

    // 無敵時間更新
    if (this.invincible) {
      this.invincibleTime -= deltaTime
      if (this.invincibleTime <= 0) {
        this.invincible = false
        this.mesh.material.opacity = 1
      } else {
        // 点滅効果
        this.mesh.material.opacity = Math.sin(this.invincibleTime * 20) * 0.5 + 0.5
      }
    }
  }

  takeDamage(amount: number): boolean {
    if (this.invincible) return false

    this.hp -= amount
    if (this.hp <= 0) {
      this.hp = 0
      return true // ゲームオーバー
    }

    // 無敵時間開始
    this.invincible = true
    this.invincibleTime = 2.0 // 2秒間無敵

    return false
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position.clone()
  }

  getMesh(): THREE.Mesh {
    return this.mesh
  }

  getHP(): number {
    return this.hp
  }

  getMaxHP(): number {
    return this.maxHp
  }
}
```

#### ステップ6: 弾実装（2日）
**実装ファイル:**
- `src/game/Bullet.ts`

**タスク:**
1. 弾メッシュ作成（小さな球体）
2. 高速移動ロジック
3. 寿命管理（画面外で削除）
4. オブジェクトプール実装（最大5発）

**コード例:**
```typescript
// src/game/Bullet.ts
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
    if (this.mesh.material instanceof THREE.Material) {
      this.mesh.material.dispose()
    }
  }
}
```

#### ステップ7: 敵実装（4日）
**実装ファイル:**
- `src/game/Enemy.ts` (基底クラス)
- `src/game/EnemyTypeA.ts`
- `src/game/EnemyTypeB.ts`
- `src/game/EnemyTypeC.ts`

**タスク:**
1. 敵基底クラス作成
2. タイプA: 直線移動
3. タイプB: 左右揺れ移動
4. タイプC: プレイヤー追尾
5. HP管理（1、2、3発）
6. 破壊エフェクト

**コード例:**
```typescript
// src/game/Enemy.ts
import * as THREE from 'three'

export abstract class Enemy {
  protected mesh: THREE.Mesh
  protected hp: number
  protected maxHp: number
  protected speed: number = 20
  public active: boolean = true

  constructor(scene: THREE.Scene, position: THREE.Vector3, hp: number) {
    this.hp = hp
    this.maxHp = hp
    this.mesh = this.createMesh()
    this.mesh.position.copy(position)
    scene.add(this.mesh)
  }

  protected abstract createMesh(): THREE.Mesh

  abstract update(deltaTime: number, playerPos: THREE.Vector3): void

  takeDamage(amount: number): boolean {
    this.hp -= amount
    if (this.hp <= 0) {
      this.active = false
      return true // 撃破
    }
    return false
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
    if (this.mesh.material instanceof THREE.Material) {
      this.mesh.material.dispose()
    }
  }
}

// src/game/EnemyTypeA.ts
import * as THREE from 'three'
import { Enemy } from './Enemy'

export class EnemyTypeA extends Enemy {
  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    super(scene, position, 1)
  }

  protected createMesh(): THREE.Mesh {
    const geometry = new THREE.TetrahedronGeometry(0.8)
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      flatShading: true
    })
    return new THREE.Mesh(geometry, material)
  }

  update(deltaTime: number, playerPos: THREE.Vector3): void {
    // 直線移動
    this.mesh.position.z += this.speed * deltaTime

    if (this.mesh.position.z > 20) {
      this.active = false
    }

    this.mesh.rotation.y += deltaTime * 2
  }
}
```

#### ステップ8: 衝突判定（2日）
**実装ファイル:**
- `src/utils/CollisionDetector.ts`

**タスク:**
1. 球体衝突判定実装（距離ベース）
2. 弾と敵の衝突
3. プレイヤーと敵の衝突
4. プレイヤーと障害物の衝突

#### ステップ9: 障害物実装（2日）
**実装ファイル:**
- `src/game/Obstacle.ts`

**タスク:**
1. 障害物メッシュ作成（岩、柱など複数種類）
2. 配置システム（地面、空中）
3. スクロール移動

#### ステップ10: UI/HUD実装（2日）
**実装ファイル:**
- `src/ui/HUD.ts`

**タスク:**
1. HTML要素作成
2. HP表示（ハートまたは数値）
3. ステージ番号表示
4. スコア枠表示（数値は0）

#### ステップ11: ゲームオーバー画面（1日）
**実装ファイル:**
- `src/ui/GameOverScreen.ts`

**タスク:**
1. ゲームオーバーUI
2. 結果表示
3. リトライボタン

#### ステップ12: ゲームループ統合（3日）
**実装ファイル:**
- `src/game/Game.ts`
- `src/main.ts`

**タスク:**
1. ゲーム状態管理（Playing, GameOver）
2. メインループ（update/render）
3. 敵のウェーブ生成
4. すべてのコンポーネント統合
5. デバッグ・調整

**MVP完成目安: 25日**

---

### フェーズ2: スコア・ステージシステム（10日）

#### タスク一覧
1. **ScoreManager実装** (2日)
   - スコア計算ロジック
   - HUDへの表示更新

2. **ステージシステム実装** (3日)
   - `src/game/Stage.ts`
   - ステージデータ定義（敵配置パターン）
   - ステージ遷移ロジック

3. **ステージクリア画面** (2日)
   - `src/ui/StageClearScreen.ts`
   - 結果表示
   - 次ステージへの遷移

4. **5ステージのデータ作成** (3日)
   - 各ステージの敵配置パターン
   - 背景カラーバリエーション
   - 難易度調整

---

### フェーズ3: ボス・パワーアップ（15日）

#### タスク一覧
1. **ボスクラス実装** (5日)
   - `src/game/Boss.ts`
   - 5種類のボスデザイン
   - 攻撃パターン
   - 弱点システム

2. **パワーアップアイテム** (4日)
   - `src/game/PowerUp.ts`
   - レーザー武器
   - ライフ回復
   - 無敵時間

3. **タイトル画面** (3日)
   - `src/ui/TitleScreen.ts`
   - ゲームタイトル
   - STARTボタン
   - ハイスコア表示
   - 操作説明

4. **ハイスコアシステム** (2日)
   - localStorage保存/読み込み
   - ランキング表示

5. **統合・調整** (1日)

---

### フェーズ4: サウンド（7日）

#### タスク一覧
1. **AudioManager実装** (2日)
   - `src/audio/AudioManager.ts`
   - Web Audio API使用
   - ボリューム管理

2. **効果音統合** (2日)
   - 各イベントに効果音追加

3. **BGM統合** (2日)
   - ステージBGM
   - ボスBGM
   - ゲームオーバーBGM

4. **音量調整・最適化** (1日)

---

## 🎨 クラス設計詳細

### 主要クラスのプロパティ・メソッド

#### Game.ts
```typescript
class Game {
  // Properties
  private sceneManager: SceneManager
  private inputManager: InputManager
  private player: Player
  private enemies: Enemy[]
  private bullets: Bullet[]
  private obstacles: Obstacle[]
  private background: Background
  private hud: HUD
  private collisionDetector: CollisionDetector
  private gameState: 'title' | 'playing' | 'gameover' | 'stageclear'
  private currentStage: number
  private clock: THREE.Clock

  // Methods
  public init(): void
  private update(deltaTime: number): void
  private render(): void
  private gameLoop(): void
  private handleCollisions(): void
  private spawnEnemies(): void
  private updateBullets(deltaTime: number): void
  private updateEnemies(deltaTime: number): void
  private checkGameOver(): void
}
```

#### Player.ts
```typescript
class Player {
  private mesh: THREE.Mesh
  private hp: number
  private maxHp: number
  private speed: number
  private bounds: { x: number, y: number }
  private shootCooldown: number
  private maxBullets: number
  private currentBullets: number
  private invincible: boolean
  private invincibleTime: number
  private powerUpState: PowerUpState

  public update(deltaTime: number, input: InputState): void
  public shoot(scene: THREE.Scene): Bullet | null
  public takeDamage(amount: number): boolean
  public heal(amount: number): void
  public activatePowerUp(type: PowerUpType): void
  public getPosition(): THREE.Vector3
  public getHP(): number
}
```

---

## 📊 データフロー

### ゲームループフロー
```
[User Input]
     ↓
[InputManager] → InputState
     ↓
[Game.update(deltaTime)]
     ├─→ Player.update(input)
     │       ├─→ Movement
     │       └─→ Shooting → Create Bullet
     ├─→ Enemies.update(playerPos)
     ├─→ Bullets.update()
     ├─→ Background.update()
     └─→ CollisionDetector
             ├─→ Bullet vs Enemy → Destroy Enemy, Add Score
             ├─→ Player vs Enemy → Player.takeDamage()
             └─→ Player vs Obstacle → Player.takeDamage()
     ↓
[Game.render()]
     └─→ Renderer.render(scene, camera)
     ↓
[HUD.update(hp, score, stage)]
```

### ステージ遷移フロー
```
Title Screen
     ↓ [START]
Stage 1 → Playing
     ↓ [All Waves Clear]
Boss Fight
     ↓ [Boss Defeated]
Stage Clear Screen
     ↓ [NEXT]
Stage 2 → ...
     ↓
Stage 5 Complete
     ↓
Game Complete Screen
```

---

## ⚙️ 技術的実装詳細

### オブジェクトプール

パフォーマンス向上のため、頻繁に生成・削除されるオブジェクト（弾、敵、パーティクル）にオブジェクトプールを使用

```typescript
class ObjectPool<T> {
  private pool: T[] = []
  private active: T[] = []

  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize: number
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory())
    }
  }

  get(): T | null {
    if (this.pool.length === 0) return null
    const obj = this.pool.pop()!
    this.active.push(obj)
    return obj
  }

  release(obj: T): void {
    const index = this.active.indexOf(obj)
    if (index > -1) {
      this.active.splice(index, 1)
      this.reset(obj)
      this.pool.push(obj)
    }
  }
}
```

### 敵ウェーブシステム

```typescript
interface WavePattern {
  enemyType: 'A' | 'B' | 'C'
  positions: THREE.Vector3[]
  spawnDelay: number
}

interface StageData {
  stageNumber: number
  waves: WavePattern[]
  backgroundColor: number
  groundColor: number
  bossType?: number
}

const STAGE_DATA: StageData[] = [
  {
    stageNumber: 1,
    waves: [
      {
        enemyType: 'A',
        positions: [
          new THREE.Vector3(-5, 2, -100),
          new THREE.Vector3(0, 2, -100),
          new THREE.Vector3(5, 2, -100)
        ],
        spawnDelay: 2.0
      },
      // ... more waves
    ],
    backgroundColor: 0x87CEEB,
    groundColor: 0x00ff00
  },
  // ... more stages
]
```

---

## 🚀 パフォーマンス最適化

### 最適化戦略

1. **ジオメトリの再利用**
   - 同じ形状の敵は同一ジオメトリを共有
   - InstancedMesh使用（多数の同一オブジェクト）

2. **描画コール削減**
   - マテリアルの統一
   - テクスチャアトラス使用

3. **衝突判定の最適化**
   - 空間分割（グリッドベース）
   - 視錐台カリング

4. **メモリ管理**
   - 使用済みオブジェクトのdispose
   - オブジェクトプール活用

5. **レンダリング最適化**
   - LOD（Level of Detail）適用
   - フラスタムカリング

### パフォーマンス計測
```typescript
class PerformanceMonitor {
  private fps: number = 0
  private frameCount: number = 0
  private lastTime: number = performance.now()

  update(): void {
    this.frameCount++
    const currentTime = performance.now()

    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
      this.frameCount = 0
      this.lastTime = currentTime
    }
  }

  getFPS(): number {
    return this.fps
  }
}
```

---

## 🚢 デプロイメント

### GitHub Actions設定

`.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### ビルド前チェックリスト
- [ ] TypeScriptエラー0件
- [ ] Lintエラー0件
- [ ] すべての機能が動作
- [ ] パフォーマンステスト通過（60fps維持）
- [ ] クロスブラウザテスト完了
- [ ] モバイルテスト完了

### デプロイ手順
1. `npm run build` でビルド
2. `dist/`フォルダ確認
3. ローカルで`npm run preview`でテスト
4. GitHub Actionsで自動デプロイ
5. `https://[username].github.io/3d-stg/` で確認

---

## 📈 進捗管理

### マイルストーン

| マイルストーン | 期間 | 完了条件 |
|--------------|------|---------|
| **M1: プロジェクトセットアップ** | 1日 | 環境構築完了、Hello Worldレンダリング |
| **M2: 基本シーン** | 2日 | カメラ、背景表示 |
| **M3: プレイヤー制御** | 5日 | プレイヤー移動、射撃 |
| **M4: 敵システム** | 6日 | 敵3種類、衝突判定 |
| **M5: MVP完成** | 11日 | 基本ゲームループ完成 |
| **M6: フェーズ2完成** | 10日 | ステージシステム |
| **M7: フェーズ3完成** | 15日 | ボス、パワーアップ |
| **M8: 最終完成** | 7日 | サウンド実装 |

### リスク管理

| リスク | 影響度 | 対策 |
|--------|--------|------|
| Three.jsの学習コスト | 中 | 公式ドキュメント、サンプル活用 |
| パフォーマンス問題 | 高 | 早期プロファイリング、最適化 |
| モバイル対応の複雑さ | 中 | タッチ操作を早期実装 |
| スコープクリープ | 高 | フェーズ分けで段階的実装 |

---

**作成日**: 2025-11-30
**バージョン**: 1.0
