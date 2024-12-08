'use client';

import { Suspense } from 'react';
import { GameController } from '@/components/game/GameController';

export default function GamePage({
  params
}: {
  params: { stage: string }
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameController />
    </Suspense>
  );
}

// 静的に生成するページのパラメータを定義
export function generateStaticParams() {
  return [
    { stage: '1' },
    { stage: '2' },
    { stage: '3' },
    { stage: '4' }
  ]
}