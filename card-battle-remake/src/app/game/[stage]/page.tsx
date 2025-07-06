'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { getEffectDescription, getCardTypeDisplay } from '@/utils/effect-descriptions';
import { getEffectRange, calculateCardEffects, getEffectColor, getEffectPreview, getAppliedEffects } from '@/utils/card-effects';
import type { Card } from '@/types';
import { DebugCardSelector } from '@/components/DebugCardSelector';
import { 
  ArrowLeft, 
  Scroll, 
  Flame, 
  Crown, 
  Waves, 
  Zap,
  Play,
  RotateCcw,
  Sword,
  Shield,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Trophy,
  Users,
  Layout,
  ChevronRight,
  Sparkles,
  Bug
} from 'lucide-react';

interface GamePageProps {
  params: {
    stage: string;
  };
}

const getStageInfo = (stage: string) => {
  const stageNum = parseInt(stage);
  const stageData = {
    1: { 
      name: 'ステージ1', 
      boss: '炎神イフリート', 
      icon: <Flame className="w-6 h-6" />,
      theme: {
        bg: 'from-red-900/50 via-orange-900/50 to-yellow-900/50',
        accent: 'border-orange-500/50',
        glow: 'shadow-orange-500/20',
        card: 'from-red-600/10 to-orange-600/10',
        primary: 'bg-orange-600',
        secondary: 'bg-red-600'
      }
    },
    2: { 
      name: 'ステージ2', 
      boss: '竜王バハムート', 
      icon: <Crown className="w-6 h-6" />,
      theme: {
        bg: 'from-purple-900/50 via-blue-900/50 to-indigo-900/50',
        accent: 'border-purple-500/50',
        glow: 'shadow-purple-500/20',
        card: 'from-purple-600/10 to-blue-600/10',
        primary: 'bg-purple-600',
        secondary: 'bg-blue-600'
      }
    },
    3: { 
      name: 'ステージ3', 
      boss: '海竜神リヴァイアサン',
      icon: <Waves className="w-6 h-6" />,
      theme: {
        bg: 'from-blue-900/50 via-cyan-900/50 to-teal-900/50',
        accent: 'border-cyan-500/50',
        glow: 'shadow-cyan-500/20',
        card: 'from-blue-600/10 to-cyan-600/10',
        primary: 'bg-cyan-600',
        secondary: 'bg-blue-600'
      }
    },
    4: { 
      name: 'ステージ4', 
      boss: '神父王オーディン',
      icon: <Zap className="w-6 h-6" />,
      theme: {
        bg: 'from-yellow-900/50 via-amber-900/50 to-orange-900/50',
        accent: 'border-yellow-500/50',
        glow: 'shadow-yellow-500/20',
        card: 'from-yellow-600/10 to-amber-600/10',
        primary: 'bg-yellow-600',
        secondary: 'bg-amber-600'
      }
    }
  };
  
  return stageData[stageNum as keyof typeof stageData] || stageData[1];
};

export default function GamePage({ params }: GamePageProps) {
  const stageInfo = getStageInfo(params.stage);
  const { state, selectCard, hoverCell, unhoverCell, placeCard, endTurn, resetGame, resetTurn, startGame, toggleDebugMode, toggleCardSelector } = useGame();
  const [selectedBoardCard, setSelectedBoardCard] = useState<Card | null>(null);
  const [hoveredBoardCard, setHoveredBoardCard] = useState<{ card: Card; position: { row: number; col: number } } | null>(null);
  
  // ゲーム開始時にステージを設定（初回のみ）
  useEffect(() => {
    const stage = parseInt(params.stage);
    // ステージが異なる場合、または初期状態（手札が空でターン1の場合）のみゲーム開始
    if (stage !== state.stage || (state.turn === 1 && state.hand.length === 0 && state.placedCards === 0)) {
      startGame(stage);
    }
  }, [params.stage, state.stage, startGame]);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* 背景エフェクト */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${stageInfo.theme.bg}`}></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ヘッダー */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-black/30 border-b border-white/10"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  戻る
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-white/90">
                    {stageInfo.icon}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{stageInfo.name}</h1>
                    <p className="text-gray-300 text-sm">vs {stageInfo.boss}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleDebugMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border group ${
                    state.debugMode.enabled 
                      ? 'bg-purple-600/30 hover:bg-purple-600/40 !text-purple-200 border-purple-400/60' 
                      : 'bg-purple-600/10 hover:bg-purple-600/20 !text-purple-300 border-purple-500/30'
                  }`}
                >
                  <Bug className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  デバッグ
                </button>
                {state.debugMode.enabled && (
                  <button
                    onClick={toggleCardSelector}
                    className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-purple-500/50 group"
                  >
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    カード追加
                  </button>
                )}
                <Link 
                  href="/cards" 
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 group"
                >
                  <Scroll className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  カード一覧
                </Link>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-300">ターン</div>
                    <div className="text-lg font-bold text-white flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {state.turn} / {state.maxTurns}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* メインゲーム画面 */}
        <div className="flex-1 container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
            
            {/* 左側: 手札エリア */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="xl:col-span-3"
            >
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">手札</h2>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {state.hand.length}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {state.hand.map((card, i) => (
                    <motion.div 
                      key={card.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectCard(state.selectedCard === i ? null : i)}
                      className={`
                        bg-gradient-to-r ${stageInfo.theme.card} backdrop-blur-sm rounded-xl p-4 border cursor-pointer transition-all duration-300
                        ${state.selectedCard === i 
                          ? `${stageInfo.theme.accent} ${stageInfo.theme.glow} shadow-lg` 
                          : 'border-white/20 hover:border-white/40'
                        }
                        ${card.type === 'ally' ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-red-400'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {card.type === 'ally' ? 
                            <Shield className="w-4 h-4 text-blue-400" /> : 
                            <Sword className="w-4 h-4 text-red-400" />
                          }
                          <span className="text-white font-medium text-sm">
                            {card.name}
                          </span>
                        </div>
                        <div className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-lg text-xs font-bold">
                          {card.points}
                        </div>
                      </div>
                      <div className="text-xs text-gray-300">
                        {card.effect ? `効果: ${getEffectDescription(card.effect)}` : '効果なし'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 中央: ゲームボード */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-6"
            >
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Layout className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">戦場</h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Target className="w-4 h-4" />
                    {state.placedCards} / {state.totalCards}
                  </div>
                </div>
                
                {/* 5x5グリッド */}
                <div className="grid grid-cols-5 gap-2 aspect-square max-w-lg mx-auto mb-6">
                  {state.board.flatMap((row, rowIndex) => 
                    row.map((cell, colIndex) => {
                      const cellIndex = rowIndex * 5 + colIndex;
                      const isHovered = state.hoveredCell?.row === rowIndex && state.hoveredCell?.col === colIndex;
                      
                      // 効果範囲の表示判定
                      let isInEffectRange = false;
                      let effectColor = '';
                      if (hoveredBoardCard) {
                        const effectRange = getEffectRange(hoveredBoardCard.card, hoveredBoardCard.position);
                        isInEffectRange = effectRange.some(pos => pos.row === rowIndex && pos.col === colIndex);
                        if (isInEffectRange) {
                          effectColor = getEffectColor(hoveredBoardCard.card.effect?.type || '');
                        }
                      }
                      
                      return (
                        <motion.div 
                          key={cellIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.02 * cellIndex }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onHoverStart={() => {
                            hoverCell(rowIndex, colIndex);
                            if (cell) {
                              setHoveredBoardCard({ card: cell, position: { row: rowIndex, col: colIndex } });
                            }
                          }}
                          onHoverEnd={() => {
                            unhoverCell();
                            setHoveredBoardCard(null);
                          }}
                          onClick={() => {
                            if (cell) {
                              setSelectedBoardCard(cell);
                              setHoveredBoardCard(null);
                            } else if (state.selectedCard !== null && state.gamePhase === 'placement') {
                              placeCard(rowIndex, colIndex);
                            }
                          }}
                          className={`
                            relative aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center group
                            ${isInEffectRange
                              ? `${effectColor} border-2`
                              : isHovered && state.selectedCard !== null && !cell
                              ? `${stageInfo.theme.accent} ${stageInfo.theme.glow} bg-white/10`
                              : cell
                              ? 'border-white/40 bg-white/10'
                              : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                            }
                          `}
                        >
                          {cell ? (
                            <div className="absolute inset-1 rounded-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex flex-col items-center justify-center text-center p-1">
                              <div className="text-xs font-bold text-white mb-1">{cell.name}</div>
                              {(() => {
                                const effectBonus = calculateCardEffects(state.board, { row: rowIndex, col: colIndex }, cell);
                                const finalPoints = Math.max(0, cell.points + effectBonus);
                                return (
                                  <div className="flex flex-col items-center">
                                    <div className={`text-xs font-bold ${
                                      effectBonus > 0 ? 'text-green-300' : 
                                      effectBonus < 0 ? 'text-red-300' : 
                                      'text-yellow-300'
                                    }`}>
                                      {finalPoints}
                                    </div>
                                    {effectBonus !== 0 && (
                                      <div className={`text-xs ${
                                        effectBonus > 0 ? 'text-green-400' : 'text-red-400'
                                      }`}>
                                        ({effectBonus > 0 ? '+' : ''}{effectBonus})
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                              <div className={`w-2 h-2 rounded-full mt-1 ${
                                cell.type === 'ally' ? 'bg-blue-400' : 'bg-red-400'
                              }`}></div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                              {rowIndex + 1}-{colIndex + 1}
                            </span>
                          )}
                          
                          {/* 配置可能ヒント */}
                          {isHovered && state.selectedCard !== null && !cell && state.gamePhase === 'placement' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 rounded-lg bg-green-500/20 border-2 border-green-400 flex items-center justify-center"
                            >
                              <Sparkles className="w-4 h-4 text-green-400" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* ゲーム操作ボタン */}
                <div className="flex justify-center gap-4">
                  {state.gamePhase === 'turnEnd' ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={endTurn}
                      className={`flex items-center gap-2 ${stageInfo.theme.primary} hover:opacity-90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg`}
                    >
                      <Play className="w-4 h-4" />
                      {state.turn >= state.maxTurns ? 'ゲーム終了' : '次のターン'}
                    </motion.button>
                  ) : state.gamePhase === 'gameEnd' ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetGame}
                      className={`flex items-center gap-2 ${stageInfo.theme.primary} hover:opacity-90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      もう一度プレイ
                    </motion.button>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={state.hand.length > 0}
                      className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                        state.hand.length > 0 
                          ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                          : `${stageInfo.theme.primary} hover:opacity-90`
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      手札を使い切ってください
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetTurn}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                    このターンをやり直し
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* 右側: 情報エリア */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-3 space-y-6"
            >
              {/* スコア表示 */}
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">スコア</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">味方</span>
                    </div>
                    <span className="text-white font-bold text-lg">{state.scores.ally}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-red-300">敵</span>
                    </div>
                    <span className="text-white font-bold text-lg">{state.scores.enemy}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300">総合</span>
                    </div>
                    <span className="text-white font-bold text-xl">{state.scores.total}</span>
                  </div>
                </div>
              </div>

              {/* ターン情報 */}
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">進行状況</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">現在ターン</span>
                    <span className="text-white font-medium">{state.turn} / {state.maxTurns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">配置済み</span>
                    <span className="text-white font-medium">{state.placedCards} / {state.totalCards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">残り手札</span>
                    <span className="text-white font-medium">{state.hand.length}枚</span>
                  </div>
                  
                  {/* プログレスバー */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>ゲーム進行</span>
                      <span>{Math.round((state.turn / state.maxTurns) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${stageInfo.theme.primary}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(state.turn / state.maxTurns) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* カード詳細 */}
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">カード詳細</h3>
                </div>
                {selectedBoardCard ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {selectedBoardCard.type === 'ally' ? 
                            <Shield className="w-5 h-5 text-blue-400" /> : 
                            <Sword className="w-5 h-5 text-red-400" />
                          }
                          <h4 className="text-white font-bold text-lg">{selectedBoardCard.name}</h4>
                        </div>
                        <button
                          onClick={() => setSelectedBoardCard(null)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">ポイント</span>
                          <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg font-bold">
                            {selectedBoardCard.points}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">タイプ</span>
                          <span className={`px-3 py-1 rounded-lg font-medium ${
                            selectedBoardCard.type === 'ally' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {selectedBoardCard.type === 'ally' ? '味方' : '敵'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">カテゴリー</span>
                          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg font-medium">
                            {getCardTypeDisplay(selectedBoardCard.category, selectedBoardCard.class || null)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">ターン</span>
                          <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-lg font-medium">
                            {selectedBoardCard.turn}
                          </span>
                        </div>
                        
                        {selectedBoardCard.effect && (
                          <div className="mt-4">
                            <span className="text-gray-300 text-sm block mb-2">このカードの効果</span>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                              <span className="text-green-300 text-sm">
                                {getEffectDescription(selectedBoardCard.effect)}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* 受けている効果の詳細 */}
                        {(() => {
                          // selectedBoardCardがボード上のどこにあるかを見つける
                          for (let row = 0; row < state.board.length; row++) {
                            for (let col = 0; col < state.board[row].length; col++) {
                              if (state.board[row][col] === selectedBoardCard) {
                                const appliedEffects = getAppliedEffects(state.board, { row, col }, selectedBoardCard);
                                if (appliedEffects.length > 0) {
                                  return (
                                    <div className="mt-4">
                                      <span className="text-gray-300 text-sm block mb-2">受けている効果</span>
                                      <div className="space-y-2">
                                        {appliedEffects.map((effect, index) => (
                                          <div 
                                            key={index}
                                            className={`p-3 rounded-lg border text-sm ${
                                              effect.effectType === 'buff' 
                                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                                                : effect.effectType === 'enhancement'
                                                ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                                                : effect.effectType === 'protection'
                                                ? 'bg-green-500/10 border-green-500/20 text-green-300'
                                                : 'bg-red-500/10 border-red-500/20 text-red-300'
                                            }`}
                                          >
                                            <div className="flex justify-between items-center">
                                              <span>{effect.description}</span>
                                              <span className="font-bold">
                                                {effect.effectType === 'debuff' ? `-${effect.value}` : 
                                                 effect.effectType === 'enhancement' ? `×${effect.value}` : 
                                                 effect.effectType === 'protection' ? '🛡️' : 
                                                 `+${effect.value}`}
                                              </span>
                                            </div>
                                            <div className="text-xs opacity-70 mt-1">
                                              位置: ({effect.sourcePosition.row + 1}-{effect.sourcePosition.col + 1})
                                            </div>
                                          </div>
                                        ))}
                                        
                                        {/* 合計効果 */}
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                          <div className="flex justify-between items-center text-yellow-300">
                                            <span className="font-bold">合計効果</span>
                                            <span className="font-bold">
                                              {(() => {
                                                const totalEffect = appliedEffects.reduce((sum, effect) => {
                                                  if (effect.effectType === 'enhancement' || effect.effectType === 'protection') return sum; // 倍率効果と保護効果は合計に含めない
                                                  return sum + (effect.effectType === 'debuff' ? -effect.value : effect.value);
                                                }, 0);
                                                return totalEffect > 0 ? `+${totalEffect}` : `${totalEffect}`;
                                              })()}
                                            </span>
                                          </div>
                                          <div className="text-sm mt-1">
                                            最終ポイント: {Math.max(0, selectedBoardCard.points + appliedEffects.reduce((sum, effect) => {
                                              if (effect.effectType === 'enhancement' || effect.effectType === 'protection') return sum; // 倍率効果と保護効果は合計に含めない
                                              return sum + (effect.effectType === 'debuff' ? -effect.value : effect.value);
                                            }, 0))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }
                            }
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <Layout className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">フィールド上のカードをクリックして詳細を表示</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* デバッグモード用カードセレクター */}
      <DebugCardSelector />
    </div>
  );
}