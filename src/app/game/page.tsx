// src/app/game/page.tsx
'use client';

import { Suspense } from 'react';
import { GameController } from '@/components/game/GameController';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameController />
    </Suspense>
  );
}