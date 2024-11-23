# Card Battle Game

5x5のグリッドで展開される戦略的カードバトルゲームです。各ステージで強力なボスと対峙し、戦略的なカード配置で勝利を目指します。

## デモ
[ゲームをプレイする](https://card-battle-game.vercel.app/)

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Local Storage (進行状況の保存)

## ゲームの特徴
- 段階的に解放される4つのステージ
- ステージごとに異なるボス（イフリート、バハムート、リヴァイアサン、オーディン）
- ステージ進行に応じて強化される敵ユニット
- ターン制の戦略的な配置バトル
- 多彩なカード効果システム

### カードシステム詳細

#### 基本ユニット（ターン1-2）
- **戦士** (基礎値: 100)
  - 縦方向の敵に対して攻撃効果
  - 基本的な戦闘ユニット

- **弓兵** (基礎値: 80)
  - 斜め方向への弱体化効果
  - 遠距離から敵を妨害

- **魔法使い** (基礎値: 70)
  - 広範囲の味方強化/敵弱体化
  - 効果重視型ユニット

- **槍兵** (基礎値: 90)
  - 横方向への効果
  - バランスの取れた戦闘力

- **守護者** (基礎値: 110)
  - 隣接する味方との連携効果
  - 高い防御力と援護能力

#### 効果・フィールドカード（ターン3-4）
1. **フィールドカード**
   - ダイヤモンド型の範囲2マス効果
   - 味方強化/敵弱体化の領域効果
   - 基礎効果値: 40

2. **武器カード**
   - 特定クラスの強化
   - 効果値の乗算補正
   - 基礎効果値: 30-50

#### リーダーカード（ターン5-6）
- **弓将のリーダー効果**
  - 斜め方向の敵を弱体化
  - 武器効果との相乗効果

- **守護者のリーダー効果**
  - 隣接する味方を強化
  - 味方の数に応じた自己強化

- **槍術士のリーダー効果**
  - 横一列の敵の数で強化
  - 列制圧型の効果

- **魔導師のリーダー効果**
  - 範囲2マスの総合強化
  - 味方ユニットとサポート強化

#### 伝説カード（ターン7）
1. **聖騎士アーサ**
   - 隣接する味方を強化（+40）
   - 範囲2マス内の武器効果を2倍化
   - 円卓の騎士の力を体現

2. **大賢者エレミア**
   - 範囲2マスの味方強化（+80）
   - 隣接する味方のマイナス効果を無効化
   - 支援特化型の伝説ユニット

3. **双剣士ウルファ**
   - 縦方向の敵に強力な弱体化（-120）
   - 瞬間的な突破力を持つアタッカー

4. **深淵術師ネクロ**
   - 範囲2マスの敵弱体化（-80）
   - 武器効果を2倍に増幅
   - 制圧と支援を兼ね備えた万能型

#### ボスカード（ターン8）
1. **炎精霊王イフリート**（ステージ1）
   - 範囲2マスの敵弱体化（-60）
   - 弱体化した敵1体につき自身が+30強化
   - 初心者でも対策が立てやすい基本的なボス

2. **竜王バハムート**（ステージ2）
   - 十字方向の敵を弱体化（-80）
   - 武器効果を無効化
   - 同じ列の味方を強化（+60）
   - メガフレアで全体に120ダメージ

3. **海竜神リヴァイアサン**（ステージ3）
   - タイダルウェーブで敵を押し流す
   - 2ターンの間、フィールド全体が水没
   - 敵ユニット全体を弱体化（-100）
   - TSUNAMIで効果を無効化しつつ大ダメージ

4. **神父王オーディン**（ステージ4）
   - ギュンギニルによる直線貫通攻撃
   - スレイプニルで移動後に効果発動可能
   - ラグナロクで味方の全効果を倍増
   - 最も戦略性が要求される最終ボス

### 効果計算システム

#### 効果の優先順位
```typescript
const EFFECT_PRIORITIES = {
  LEGENDARY: 120,  // 伝説カード効果
  LEADER: 100,     // リーダー効果
  WEAPON: 80,      // 武器効果
  FIELD: 60,       // フィールド効果
  UNIT: 40,        // ユニット効果
  DEBUFF: 30,      // 弱体化効果
  BASE: 20         // 基本効果
};
```

#### 基礎点数の計算
```typescript
export const BASE_POINTS = {
  UNIT: {
    warrior: 100,    // 戦士
    archer: 80,      // 弓兵
    mage: 70,        // 魔法使い
    knight: 120,     // 騎士
    lancer: 90,      // 槍兵
    guardian: 110    // 守護者
  },
  FIELD: 80,         // フィールド効果
  WEAPON: 50,        // 武器強化
  SUPPORT: 40        // サポート効果
};
```

#### 成長率システム
```typescript
export const TURN_GROWTH_RATE = {
  1: { ally: 0.8, enemy: 1.0 },   // 基本ターン
  2: { ally: 1.0, enemy: 1.2 },   // 発展ターン
  3: { ally: 1.2, enemy: 1.5 },   // フィールドカード
  4: { ally: 1.4, enemy: 1.7 },   // 武器カード
  5: { ally: 1.6, enemy: 2.2 },   // 補強カード
  6: { ally: 1.8, enemy: 2.2 },   // リーダーカード
  7: { ally: 3.0, enemy: 2.2 },   // 伝説カード
  8: { ally: 2.0, enemy: 2.5 }    // ボスカード
};
```

#### ステージ補正システム
```typescript
export const STAGE_ENEMY_RATE = {
  1: 1.0,   // 基本値
  2: 1.2,   // +20%
  3: 1.5,   // +50%
  4: 1.8    // +80%
};
```

#### 効果値の基本設定
```typescript
export const EFFECT_VALUES = {
  ADJACENT: 20,      // 隣接効果
  VERTICAL: 30,      // 縦方向効果
  HORIZONTAL: 30,    // 横方向効果
  DIAGONAL: 40,      // 斜め方向効果
  FIELD: 40,         // フィールド効果
  LEADER: 50         // リーダー効果
};
```

### 効果判定システム

#### 位置関係の判定
```typescript
// マンハッタン距離による範囲判定
function calculateManhattanDistance(from: Position, to: Position): number {
  return Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
}

// 隣接判定
function isAdjacent(pos1: Position, pos2: Position): boolean {
  const distance = calculateManhattanDistance(pos1, pos2);
  return distance === 1;
}

// 斜め隣接判定
function isDiagonallyAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos2.row - pos1.row);
  const colDiff = Math.abs(pos2.col - pos1.col);
  return rowDiff === 1 && colDiff === 1;
}
```
### 特殊効果の実装

#### エレミアの保護効果
```typescript
// マイナス効果の無効化判定
const hasSageProtection = 
  sourceCell.card.effect.type === 'LEGENDARY_SAGE' &&
  calculateManhattanDistance(context.sourcePosition, context.targetPosition) === 1 &&
  targetCard.card.type === sourceCell.card.type &&
  targetCard.card.category === 'unit';

// 効果の適用
if (hasSageProtection && value < 0) {
  value = 0;  // マイナス効果を無効化
}
```

#### 武器効果の乗算処理
```typescript
function calculateEffectMultiplier(context: EffectContext): number {
  // 武器カードの場合のみ乗算効果を適用
  if (sourceCard.category === 'weapon') {
    // アーサとネクロの武器強化効果を計算
    if (hasLegendaryWeaponBoost) {
      multiplier *= 2;
    }
    // 通常の武器強化効果を計算
    if (hasWeaponEnhancement) {
      multiplier *= effect.effectMultiplier;
    }
  }
  return multiplier;
}
```

### ファイル構造と実装詳細

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # タイトル画面
│   ├── game/
│   │   └── page.tsx            # メインゲーム画面
│   └── layout.tsx              # 共通レイアウト
│
├── components/
│   ├── board/                   # ゲームボード関連
│   │   ├── Board.tsx           # メインボード
│   │   ├── PlacedCardContent   # 配置済カード表示
│   │   └── PreviewContent      # 配置プレビュー
│   │
│   ├── card/                    # カード関連
│   │   ├── AnimatedCard        # アニメーション付きカード
│   │   ├── CardDetails         # カード詳細表示
│   │   └── CardScore          # スコア表示
│   │
│   ├── effects/                 # エフェクト表示関連
│   │   ├── EffectDisplay      # 基本エフェクト
│   │   ├── EffectRange        # 範囲表示
│   │   └── EffectPatterns     # エフェクトパターン
│   │
│   └── game/                    # ゲーム進行関連
│       ├── GameController      # ゲーム進行制御
│       └── TurnTransition     # ターン遷移演出
│
├── hooks/                       # カスタムフック
│   ├── useGameState           # ゲーム状態管理
│   ├── useGameProgress        # 進行状況管理
│   ├── useEffects            # エフェクト制御
│   └── useAnimations         # アニメーション制御
│
├── utils/                       # ユーティリティ
│   ├── cards/                  # カード関連
│   ├── effects/               # エフェクト計算
│   └── score/                 # スコア計算
│
└── constants/                   # 定数定義
    └── cards/                  # カードデータ
```

### 主要コンポーネントの役割

#### Board.tsx
- 5x5のグリッド表示
- カードの配置処理
- エフェクト範囲の表示
- プレビュー表示

#### GameController.tsx
- ゲームの進行管理
- ターン制御
- 勝利判定
- 状態管理

#### EffectSystem
- エフェクト計算の中核
- 効果の範囲判定
- 効果値の計算
- 特殊効果の処理

### 状態管理システム

```typescript
// ゲーム状態の型定義
type GameState = {
  board: (PlacedCard | null)[][];     // ボード状態
  currentHand: Card[];                // 現在の手札
  nextHand: Card[];                   // 次のターンの手札
  selectedCard: Card | null;          // 選択中のカード
  status: {
    turn: number;                     // 現在のターン
    allyScore: number;                // 味方スコア
    enemyScore: number;               // 敵スコア
    gameOver: boolean;                // ゲーム終了フラグ
    winner: 'ally' | 'enemy' | null;  // 勝者
  };
  canEndTurn: boolean;                // ターン終了可能か
  history: GameHistory[];             // 行動履歴
  currentStage: number;               // 現在のステージ
};

// 進行状況の型定義
type GameProgress = {
  clearedStages: number[];            // クリア済みステージ
  currentStage: number;               // 現在のステージ
};
```
### アニメーションシステム

#### カード配置アニメーション
```typescript
// AnimatedCard.tsx
<motion.div
  initial={{ scale: 0, x: -100, rotateY: 180 }}
  animate={{ scale: 1, x: 0, rotateY: 0 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20,
    delay: index * 0.1
  }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* カードコンテンツ */}
</motion.div>
```

#### エフェクト範囲表示
```typescript
// EffectRangeOverlay.tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: [0.3, 0.6, 0.3] }}
  transition={{ 
    duration: 1.5, 
    repeat: Infinity 
  }}
  className="absolute inset-0 pointer-events-none"
  style={{ 
    backgroundColor: effectStyle.color,
    opacity: effectStyle.intensity 
  }}
/>
```

### パフォーマンス最適化

#### エフェクト計算のメモ化
```typescript
const effectRange = useMemo(() => {
  if (!hoveredPosition) return [];
  const card = board[hoveredPosition.row][hoveredPosition.col];
  if (!card?.card.effect) return [];
  
  return getEffectRange(card.card.effect, hoveredPosition);
}, [hoveredPosition, board]);
```

#### レンダリング最適化
- メモ化されたコンポーネント
- 効果的なコンポーネント分割
- 適切なkey指定による再レンダリング制御

```typescript
const BoardCell = memo(({
  position,
  cell,
  isSelected,
  isHovered,
  isInEffectRange,
  onCellClick,
  onCellHover,
  onCellLeave,
  selectedCard,
  previewScore,
  board
}: BoardCellProps) => {
  // セルの実装
});
```

### 開発環境のセットアップ

#### 必要な環境
- Node.js 18以上
- npm 8以上

#### インストール手順
```bash
# リポジトリのクローン
git clone https://github.com/yourusername/card-battle-game.git

# プロジェクトディレクトリへ移動
cd card-battle-game

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 静的エクスポート
npm run export
```

### 開発ガイドライン

#### コーディング規約
- TypeScriptの厳格な型チェック
- ESLintによるコード品質管理
- Prettierによるコードフォーマット
- コンポーネントの単一責任原則

#### コミット規約
```
feat: 新機能
fix: バグ修正
docs: ドキュメント
style: フォーマット
refactor: リファクタリング
test: テスト
chore: その他
```

#### Pull Request手順
1. feature/ブランチの作成
2. 変更の実装
3. テストの実行
4. PRテンプレートに従って記述
5. レビュー依頼

### 今後の開発予定

#### 短期目標
1. オンライン対戦機能
   - WebSocketによるリアルタイム通信
   - マッチメイキングシステム
   - リプレイ機能

2. デッキビルド機能
   - カスタムデッキの作成
   - デッキの保存と共有
   - カードの解放システム

3. ユーザー管理機能
   - プロフィール管理
   - 戦績記録
   - ランキングシステム

#### 長期目標
1. カードコンテンツの拡張
   - 新規カードの追加
   - 新しい効果タイプの実装
   - 新規ボスの追加

2. ゲームモードの追加
   - ストーリーモード
   - チャレンジモード
   - デイリーミッション

3. コミュニティ機能
   - フレンド機能
   - チャット機能
   - トーナメント機能

### バグ報告

Issues に以下の情報を含めて報告してください：
- 発生状況
- 再現手順
- 期待される動作
- 実際の動作
- スクリーンショット

### ライセンス

MIT License

Copyright (c) 2024 Your Name

このソフトウェアおよび関連文書ファイル（以下「ソフトウェア」）の複製を取得するすべての人に対し、
ソフトウェアを無制限に扱うことを無償で許可します。これには、ソフトウェアの複製を使用、複写、変更、
結合、掲載、頒布、サブライセンス、および/または販売する権利、およびソフトウェアを提供する相手に
同じことを許可する権利も無制限に含まれます。

上記の著作権表示および本許諾表示を、ソフトウェアのすべての複製または重要な部分に記載するものとします。

ソフトウェアは「現状のまま」で、明示であるか暗黙であるかを問わず、何らの保証もなく提供されます。
ここでいう保証とは、商品性、特定の目的への適合性、および権利非侵害についての保証も含みますが、
それに限定されるものではありません。 作者または著作権者は、契約行為、不法行為、またはそれ以外であろうと、
ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の扱いによって生じる一切の請求、
損害、その他の義務について何らの責任も負わないものとします。