export type CardType = 'ally' | 'enemy';
export type CardCategory = 'unit' | 'field' | 'weapon';
export type UnitClass = 'warrior' | 'archer' | 'mage' | 'knight' | 'lancer' | null;
export type Position = {
  row: number;
  col: number;
};