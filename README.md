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

### ステージシステム
1. ステージ1: 炎精霊王イフリート
   - 基本的な難易度で、ゲームシステムの理解に最適
   - 敵ユニットは通常の強さ

2. ステージ2: 竜王バハムート（要:ステージ1クリア）
   - 敵ユニットが20%強化
   - より戦略的な配置が要求される

3. ステージ3: 海竜神リヴァイアサン（要:ステージ2クリア）
   - 敵ユニットが50%強化
   - 高度な戦略が必要

4. ステージ4: 神父王オーディン（要:ステージ3クリア）
   - 敵ユニットが80%強化
   - 最高難度の戦略性

### ターン構造
1. ターン1-2: 基本ユニット
2. ターン3-4: 効果・フィールドカード
3. ターン5-6: 武器・リーダーカード
4. ターン7: 伝説カード
5. ターン8: ボス戦

## ファイル構造の詳細

```
src/
├── app/                                    # Next.js App Router
│   ├── page.tsx                           # タイトル画面
│   ├── game/
│   │   └── page.tsx                       # メインゲーム画面
│   └── layout.tsx                         # 共通レイアウト
│
├── components/
│   ├── board/                             # ゲームボード関連
│   │   ├── Board.tsx                      # メインボード
│   │   ├── PlacedCardContent.tsx          # 配置済カード表示
│   │   └── PreviewContent.tsx             # 配置プレビュー
│   │
│   ├── card/
│   │   ├── AnimatedCard.tsx               # アニメーション付きカード
│   │   ├── CardDetails.tsx                # カード詳細表示
│   │   └── CardScore.tsx                  # スコア表示
│   │
│   ├── effects/                           # エフェクト表示関連
│   │   ├── EffectDisplay.tsx              # 基本エフェクト
│   │   ├── EffectRangeOverlay.tsx         # 範囲表示
│   │   └── EffectPatterns.tsx             # エフェクトパターン
│   │
│   └── game/
│       ├── GameController.tsx             # ゲーム進行制御
│       └── TurnTransition.tsx             # ターン遷移演出
│
├── hooks/
│   ├── useGameState.ts                    # ゲーム状態管理
│   ├── useGameProgress.ts                 # 進行状況管理
│   ├── useEffects.ts                      # エフェクト制御
│   └── useAnimations.ts                   # アニメーション制御
│
├── utils/
│   ├── cards/                             # カード関連ユーティリティ
│   │   └── index.ts                       # カード生成・管理
│   │
│   ├── effects/                           # エフェクト計算
│   │   ├── effect-system.ts               # エフェクト処理
│   │   └── effect-utils.ts                # 補助関数
│   │
│   └── score/                             # スコア計算
│       └── calculator.ts                   # スコア計算ロジック
│
└── constants/
    └── cards/                             # カードデータ
        ├── basic-units.ts                 # 基本ユニット
        ├── effect-units.ts                # 効果ユニット
        ├── field-cards.ts                 # フィールドカード
        ├── weapon-cards.ts                # 武器カード
        ├── boss-cards.ts                  # ボスカード
        └── card-base.ts                   # 基本パラメータ
```

## 実装の詳細

### ステート管理
- useGameState: メインのゲームロジック管理
- useGameProgress: ローカルストレージによる進行状況管理
- カードの生成とステージ補正の一元管理

### スコアシステム
1. 基礎点数計算
   - ユニット基本値
   - ターン進行による成長率
   - ステージ補正（敵ユニット）

2. 効果計算システム
   - エフェクト優先度による処理順序
   - 範囲判定と方向判定
   - 効果の累積計算

### 進行管理システム
- ステージクリア状態の永続化
- 条件付きステージアンロック
- クリア後の自動遷移

### アニメーションシステム
- Framer Motionによる流動的なUI
- カード配置アニメーション
- エフェクト範囲表示
- ターン遷移エフェクト

## 開発予定の機能
1. オンライン機能
   - リアルタイム対戦
   - ランキングシステム
   - リプレイ共有

2. カスタマイズ
   - デッキビルド
   - カスタムルール
   - スキン変更

3. コンテンツ拡張
   - 新規ステージ
   - 新規ボス
   - 特殊カード

### ゲーム詳細ルール

#### 勝利条件
- ステージ8でのボス撃破
- 最終的な味方スコアが敵スコアを上回る
- 全マスへのカード配置完了

#### ステージ進行システム
- 各ステージでの勝利でステージ解放
- 敵の強化率
  - ステージ1: 基本値(x1.0)
  - ステージ2: +20%(x1.2)
  - ステージ3: +50%(x1.5)
  - ステージ4: +80%(x1.8)

#### ボス特性
1. **炎精霊王イフリート**（ステージ1）
   - 範囲2マスの敵弱体化
   - 弱体化数に応じた自己強化

2. **竜王バハムート**（ステージ2）
   - 十字方向の範囲効果
   - メガフレア全体攻撃

3. **海竜神リヴァイアサン**（ステージ3）
   - タイダルウェーブによる範囲効果
   - フィールド全体への影響

4. **神父王オーディン**（ステージ4）
   - ギュンギニルの貫通攻撃
   - 味方効果の増幅

### 技術仕様

#### パフォーマンス最適化
- エフェクト計算のメモ化
- カード生成の効率化
- レンダリング最適化

#### 状態管理
```typescript
type GameState = {
  board: (PlacedCard | null)[][];
  currentHand: Card[];
  nextHand: Card[];
  selectedCard: Card | null;
  status: {
    turn: number;
    allyScore: number;
    enemyScore: number;
    gameOver: boolean;
    winner: 'ally' | 'enemy' | null;
  };
  canEndTurn: boolean;
  history: GameHistory[];
  currentStage: number;
};
```

#### 進行状況の永続化
```typescript
type GameProgress = {
  clearedStages: number[];
  currentStage: number;
};
```

### 環境構築
```bash
# インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 静的エクスポート
npm run export
```

## 開発への参加

1. 開発環境のセットアップ
```bash
git clone https://github.com/yourusername/card-battle-game.git
cd card-battle-game
npm install
```

2. ブランチ作成
```bash
git checkout -b feature/your-feature-name
```

3. コミット規約
```
feat: 新機能
fix: バグ修正
docs: ドキュメント
style: フォーマット
refactor: リファクタリング
test: テスト
chore: その他
```

4. Pull Request作成
- テンプレートに従って記入
- スクリーンショットなどの追加
- レビュー待ち

### バグ報告
Issues に以下の情報を含めて報告:
- 発生状況
- 再現手順
- 期待される動作
- 実際の動作
- スクリーンショット

## ライセンス

MIT License

Copyright (c) 2024 Your Name

See [LICENSE](./LICENSE) for details.