import type { Position, PlacedCard, Card } from '@/types';

export type BoardProps = {
    board: (PlacedCard | null)[][];
    selectedCard: Card | null;
    onPlaceCard: (position: Position) => void;
    onHoverCard: (card: { card: PlacedCard; position: Position; } | null) => void;
    effectRange?: Position[];
    hoveredPosition?: Position | null;
    setHoveredPosition?: (position: Position | null) => void;
  };