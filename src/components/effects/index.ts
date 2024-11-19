// src/components/effects/index.ts

export { EffectDisplay } from './EffectDisplay';
export { EffectRangeOverlay } from './EffectRangeOverlay';
export { EffectLine } from './EffectLine';
export {
  EffectPattern,
  DiagonalPattern,
  VerticalPattern,
  HorizontalPattern,
  CrossPattern,
  getEffectPattern
} from './EffectPatterns';

// 型のエクスポート
export type { EffectLineProps } from './EffectLine';
export type { EffectRangeOverlayProps } from './EffectRangeOverlay';
export type { EffectDisplayProps } from './EffectDisplay';
export type { EffectPatternProps } from './EffectPatterns';

// 追加のユーティリティタイプ
export type EffectStyle = {
  color: string;
  intensity: number;
  pattern: string;
};

// パターンタイプの定義
export type PatternType = 
  | 'vertical'
  | 'horizontal'
  | 'diagonal'
  | 'cross'
  | 'dots'
  | 'waves';