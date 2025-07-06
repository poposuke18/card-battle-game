'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Flame, 
  Crown, 
  Waves, 
  Zap, 
  Play, 
  Lock, 
  Star,
  Swords,
  Shield,
  Scroll,
  Settings,
  ChevronRight
} from 'lucide-react';

interface StageInfo {
  id: number;
  name: string;
  boss: string;
  description: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Extreme';
  unlocked: boolean;
  icon: React.ReactNode;
  theme: {
    gradient: string;
    accent: string;
    glow: string;
  };
}

const stages: StageInfo[] = [
  {
    id: 1,
    name: 'ステージ1',
    boss: '炎神イフリート',
    description: '灼熱の炎を操る精霊王との戦い',
    difficulty: 'Easy',
    unlocked: true,
    icon: <Flame className="w-8 h-8" />,
    theme: {
      gradient: 'from-red-600/20 via-orange-500/20 to-yellow-500/20',
      accent: 'border-orange-500/50 hover:border-orange-400',
      glow: 'shadow-orange-500/20'
    }
  },
  {
    id: 2,
    name: 'ステージ2', 
    boss: '竜王バハムート',
    description: '伝説の竜王が咆哮する戦場',
    difficulty: 'Normal',
    unlocked: true,
    icon: <Crown className="w-8 h-8" />,
    theme: {
      gradient: 'from-purple-600/20 via-blue-500/20 to-indigo-500/20',
      accent: 'border-purple-500/50 hover:border-purple-400',
      glow: 'shadow-purple-500/20'
    }
  },
  {
    id: 3,
    name: 'ステージ3',
    boss: '海竜神リヴァイアサン', 
    description: '深海より現れし古の神との対峙',
    difficulty: 'Hard',
    unlocked: true,
    icon: <Waves className="w-8 h-8" />,
    theme: {
      gradient: 'from-blue-600/20 via-cyan-500/20 to-teal-500/20',
      accent: 'border-cyan-500/50 hover:border-cyan-400',
      glow: 'shadow-cyan-500/20'
    }
  },
  {
    id: 4,
    name: 'ステージ4',
    boss: '神父王オーディン',
    description: '神々の王が運命を書き換える最終決戦',
    difficulty: 'Extreme',
    unlocked: true,
    icon: <Zap className="w-8 h-8" />,
    theme: {
      gradient: 'from-yellow-600/20 via-amber-500/20 to-orange-500/20',
      accent: 'border-yellow-500/50 hover:border-yellow-400',
      glow: 'shadow-yellow-500/20'
    }
  }
];

const getDifficultyConfig = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': 
      return { 
        color: 'text-green-400', 
        bg: 'bg-green-500/10 border-green-500/30',
        stars: 1
      };
    case 'Normal': 
      return { 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10 border-blue-500/30',
        stars: 2
      };
    case 'Hard': 
      return { 
        color: 'text-orange-400', 
        bg: 'bg-orange-500/10 border-orange-500/30',
        stars: 3
      };
    case 'Extreme': 
      return { 
        color: 'text-red-400', 
        bg: 'bg-red-500/10 border-red-500/30',
        stars: 4
      };
    default: 
      return { 
        color: 'text-gray-400', 
        bg: 'bg-gray-500/10 border-gray-500/30',
        stars: 1
      };
  }
};

export const StageSelect: React.FC = () => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 背景の装飾的要素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ヘッダー */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <Swords className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Card Battle
            </h1>
            <h2 className="text-4xl font-light text-white/80 mb-2">Remake</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            戦略的カードバトルゲーム - 挑戦するステージを選択してください
          </motion.p>
        </motion.header>

        {/* ステージ選択グリッド */}
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {stages.map((stage, index) => {
              const difficultyConfig = getDifficultyConfig(stage.difficulty);
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  onHoverStart={() => setHoveredStage(stage.id)}
                  onHoverEnd={() => setHoveredStage(null)}
                  className="perspective-1000"
                >
                  <Link href={stage.unlocked ? `/game/${stage.id}` : '#'}>
                    <motion.div
                      whileHover={{ 
                        scale: 1.05, 
                        rotateY: 5,
                        z: 50
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative h-64 rounded-2xl border backdrop-blur-sm overflow-hidden
                        bg-gradient-to-br ${stage.theme.gradient}
                        ${stage.theme.accent} ${stage.theme.glow}
                        ${stage.unlocked 
                          ? 'cursor-pointer shadow-2xl' 
                          : 'opacity-50 cursor-not-allowed grayscale'
                        }
                        transition-all duration-500 transform-gpu
                      `}
                    >
                      {/* 背景パターン */}
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* ロックアイコン */}
                      {!stage.unlocked && (
                        <div className="absolute top-4 right-4 z-20">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      {/* メインコンテンツ */}
                      <div className="relative z-10 h-full flex flex-col justify-between p-6">
                        {/* 上部：アイコンと難易度 */}
                        <div className="flex justify-between items-start">
                          <motion.div 
                            className="text-white/90"
                            animate={hoveredStage === stage.id ? { 
                              scale: 1.1, 
                              rotate: [0, -5, 5, 0] 
                            } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {stage.icon}
                          </motion.div>
                          
                          <div className={`px-3 py-1 rounded-full border ${difficultyConfig.bg} ${difficultyConfig.color}`}>
                            <div className="flex items-center gap-1 text-xs font-medium">
                              <span>{stage.difficulty}</span>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 4 }, (_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${
                                      i < difficultyConfig.stars 
                                        ? 'fill-current' 
                                        : 'stroke-current fill-transparent'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 中央：ステージ情報 */}
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {stage.name}
                          </h2>
                          <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center justify-center gap-2">
                            <Crown className="w-5 h-5" />
                            {stage.boss}
                          </h3>
                          <p className="text-gray-200 text-sm leading-relaxed opacity-90">
                            {stage.description}
                          </p>
                        </div>

                        {/* 下部：プレイボタン */}
                        {stage.unlocked && (
                          <motion.div 
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group">
                              <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              挑戦する
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* ホバー時の追加エフェクト */}
                      <AnimatePresence>
                        {hoveredStage === stage.id && stage.unlocked && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* フッター */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center py-8 border-t border-white/10 backdrop-blur-sm"
        >
          <div className="flex justify-center items-center gap-8 text-sm">
            <Link 
              href="/cards" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <Scroll className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              カード一覧
            </Link>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <Link 
              href="/rules" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
              ルール説明
            </Link>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <Link 
              href="/settings" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <Settings className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              設定
            </Link>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};