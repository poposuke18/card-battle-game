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
    leaderBonus?: LeaderEffectBonus;  // リーダー効果によるボーナス
    totalPoints: number;
  };