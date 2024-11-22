// src/types/index.ts

// 基本型のエクスポート
export type {
    Position,
    CardType,
    CardCategory,
    UnitClass,
    Direction,
    EffectType,
    AnimationState
  } from './base';
  
  // カード関連の型のエクスポート
  export type {
    Card,
    PlacedCard,
    CardState,
    CardAction,
    HandCard,
    DeckConfig
  } from './cards';
  
  // エフェクト関連の型のエクスポート
  export type {
    BaseEffect,
    WeaponEffect,
    LeaderEffect,
    BaseEffectType,
    WeaponEffectType,
    LeaderEffectType,
    LegendaryEffectType,
    SupportEffect,
    BossEffect,
    BossEffectType,
    EffectDetails,
    LegendaryEffect,
    FieldEffectType,  // 追加
    FieldEffect, 
    EffectContext,
    EffectWithType,
    Effect,
    EffectResult
  } from './effects';
  
  // ゲーム関連の型のエクスポート
  export type {
    GameState,
    GameStatus,
    GamePhase,
    GameAction,
    GameHistory,
    SpecialRule,
    TurnData,
    GameSettings,
    GameProgress,
    GameStats
  } from './game';

  export type ScoreDetails = {
    basePoints: number;
    effectPoints: number;
    leaderEffectPoints: number;
    weaponEffectPoints: number;
    fieldEffectPoints: number;
    supportEffectPoints: number;
    totalPoints: number;
    effectBreakdown: Array<{
      type: string;
      value: number;
      source: string;
    }>;
  };

  export { isFieldEffect } from './effects';  // 型ガード関数のエクスポート
