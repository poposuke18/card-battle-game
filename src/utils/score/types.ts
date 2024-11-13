export type LeaderEffectBonus = {
    defenseBonus?: number;
    attackBonus?: number;
    supportBonus?: number;
    weaponBonus?: number;
    counterAttack?: number;
  };
  
  export type ScoreDetails = {
    basePoints: number;
    effectPoints: number;
    leaderEffectPoints: number;  // リーダー効果によるポイント
    totalPoints: number;
  };