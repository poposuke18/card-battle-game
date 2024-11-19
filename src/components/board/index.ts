// src/components/board/index.ts

export { Board } from './Board';
export { PlacedCardContent } from './PlacedCardContent';
export { PreviewContent } from './PreviewContent';

// 型のエクスポート
export type { 
  PlacedCardContentProps 
} from './PlacedCardContent';
export type { 
  PreviewContentProps 
} from './PreviewContent';

// 必要に応じて追加の内部コンポーネントをエクスポート
export {
  // 例: 将来的に追加される可能性のある関連コンポーネント
  // BoardCell,
  // BoardGrid,
  // など
} from './Board';