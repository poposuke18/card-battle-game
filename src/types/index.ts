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
    FieldEffectType,  // 追加
    FieldEffect, 
    EffectContext,
    EffectResult
  } from './effects';
  
  // ゲーム関連の型のエクスポート
  export type {
    GameState,
    GameStatus,
    GamePhase,
    GameAction,
    GameHistory,
    TurnData,
    GameSettings,
    GameStats
  } from './game';

  export { isFieldEffect } from './effects';  // 型ガード関数のエクスポート
