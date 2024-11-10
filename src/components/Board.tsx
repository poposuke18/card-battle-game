import { PlacedCard, Position } from '@/types/game';

type BoardProps = {
  board: (PlacedCard | null)[][];
  onPlaceCard: (position: Position) => void;
};

export default function Board({ board, onPlaceCard }: BoardProps) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-8">
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="aspect-square bg-white border-2 border-gray-300 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-gray-50"
            onClick={() => onPlaceCard({ row: rowIndex, col: colIndex })}
          >
            {cell ? (
              <div className={`w-full h-full rounded flex items-center justify-center
                ${cell.card.type === 'ally' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}
              >
                <span className="font-bold text-sm">{cell.card.points}</span>
              </div>
            ) : null}
          </div>
        ))
      ))}
    </div>
  );
}