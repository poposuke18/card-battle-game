// src/types/base.ts

export type Position = {
    row: number;
    col: number;
  };
  
  export type CardType = 'ally' | 'enemy';
  
  export type CardCategory = 'unit' | 'field' | 'weapon' | 'support';
  
  export type UnitClass = 
    | 'warrior'   // 戦士：縦方向効果
    | 'archer'    // 弓兵：斜め方向妨害
    | 'mage'      // 魔法使い：広範囲効果
    | 'knight'    // 騎士：周囲強化
    | 'lancer'    // 槍兵：横方向効果
    | 'guardian'  // 盾兵：隣接効果
    | null;
  
  export type Direction = 
    | 'vertical'
    | 'horizontal'
    | 'diagonal'
    | 'adjacent'
    | 'all';
  
  export type EffectType = 
    | 'buff'
    | 'debuff'
    | 'hybrid';
  
  export type AnimationState = {
    isAnimating: boolean;
    type: string;
    duration: number;
  };