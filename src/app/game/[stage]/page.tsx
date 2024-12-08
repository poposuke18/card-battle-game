'use client';

import { Suspense } from 'react';
import { GameController } from '@/components/game/GameController';
import { useParams } from 'next/navigation';

export default function GamePage() {
  const params = useParams();
  const stageNumber = Number(params.stage) || 1;

  if (stageNumber < 1 || stageNumber > 4) {
    return <div>Invalid stage</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameController initialStage={stageNumber} />
    </Suspense>
  );
}