// src/components/effects/index.ts

export { EffectRangeOverlay } from './EffectRangeOverlay';
export { EffectLine } from './EffectLine';
export {
  EffectPattern as EffectPatternComponent,  // 名前を変更
  DiagonalPattern,
  VerticalPattern,
  getEffectPattern
} from './EffectPatterns';

export { 
  EffectIcon, 
  EffectDescription, 
  EffectPattern 
} from './EffectDisplay';

// 型のエクスポート
export type { EffectLineProps } from './EffectLine';
export type { EffectRangeOverlayProps } from './EffectRangeOverlay';
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