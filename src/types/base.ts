export type CardType = 'ally' | 'enemy';
export type CardCategory = 'unit' | 'field' | 'weapon' | 'support';  // supportを追加
export type UnitClass = 'warrior' | 'archer' | 'mage' | 'knight' | 'lancer' | 'guardian' | null;
export type Position = {
  row: number;
  col: number;
};