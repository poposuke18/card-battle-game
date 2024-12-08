'use client';

import { Suspense } from 'react';
import { GameController } from '@/components/game/GameController';

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameController />
    </Suspense>
  );
}