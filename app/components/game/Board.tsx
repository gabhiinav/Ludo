import { Cell } from "./Cell";
import { Token } from "./Token";
import { useLudoGame, PlayerColor } from "@/app/hooks/useLudoGame";
import {
  PATH_COORDINATES,
  HOME_STRETCH_COORDINATES,
  BASE_COORDINATES,
  PLAYER_START_INDICES,
} from "./board-utils";
import { cn } from "@/lib/utils";

interface BoardProps {
  game?: ReturnType<typeof useLudoGame>;
}

export function Board({ game }: BoardProps) {
  // If no game provided (e.g. initial render or error), render empty board
  if (!game) return null;

  const { gameState, moveToken } = game;

  const getTokenPosition = (
    player: PlayerColor,
    position: number,
    status: "base" | "active" | "home",
    tokenIndex: number
  ) => {
    if (status === "base") {
      return BASE_COORDINATES[player][tokenIndex];
    }

    if (status === "home") {
      // Center of board roughly
      return { row: 7, col: 7 };
    }

    if (status === "active") {
      // Calculate global path index
      // Each player has a start index
      // Total path length is 52
      const startIndex = PLAYER_START_INDICES[player];
      
      if (position < 51) {
        // Main path
        const globalIndex = (startIndex + position) % 52;
        return PATH_COORDINATES[globalIndex];
      } else {
        // Home stretch
        const homeIndex = position - 51; // 0 to 5
        // Ensure we don't go out of bounds
        const safeIndex = Math.min(homeIndex, 5);
        return HOME_STRETCH_COORDINATES[player][safeIndex];
      }
    }
    
    return { row: 0, col: 0 };
  };

  return (
    <div className="aspect-square w-full max-w-[600px] rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative grid h-full w-full grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] gap-0.5 bg-zinc-100 dark:bg-zinc-900">
        {/* Render Static Board Layout */}
        {/* Top Left - Red Base */}
        <div className="col-span-6 row-span-6 bg-white p-4 dark:bg-zinc-950" style={{ gridColumn: "1 / span 6", gridRow: "1 / span 6" }}>
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/10" />
        </div>

        {/* Top Right - Green Base */}
        <div className="col-span-6 row-span-6 bg-white p-4 dark:bg-zinc-950" style={{ gridColumn: "10 / span 6", gridRow: "1 / span 6" }}>
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/10" />
        </div>

        {/* Bottom Left - Blue Base */}
        <div className="col-span-6 row-span-6 bg-white p-4 dark:bg-zinc-950" style={{ gridColumn: "1 / span 6", gridRow: "10 / span 6" }}>
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/10" />
        </div>

        {/* Bottom Right - Yellow Base */}
        <div className="col-span-6 row-span-6 bg-white p-4 dark:bg-zinc-950" style={{ gridColumn: "10 / span 6", gridRow: "10 / span 6" }}>
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/10" />
        </div>
        
        {/* Center Home */}
        <div className="col-span-3 row-span-3 bg-zinc-100 dark:bg-zinc-900" style={{ gridColumn: "7 / span 3", gridRow: "7 / span 3" }}>
             <div className="relative h-full w-full">
                 <div className="absolute top-0 left-0 w-full h-full bg-zinc-200 dark:bg-zinc-800 opacity-50" />
             </div>
        </div>

        {/* Render Cells (Optional, for visual grid) */}
        {/* We can skip rendering individual cells if we just use the background color of the grid gap */}
        {/* But let's render path cells for better visuals */}
        {PATH_COORDINATES.map((coord, i) => (
             <div 
                key={`path-${i}`}
                className="bg-white dark:bg-zinc-950"
                style={{ gridColumn: coord.col + 1, gridRow: coord.row + 1 }}
             />
        ))}
        
        {/* Render Home Stretch Cells */}
        {Object.entries(HOME_STRETCH_COORDINATES).map(([color, coords]) => (
            coords.map((coord, i) => (
                <div 
                    key={`home-${color}-${i}`}
                    className={cn(
                        "opacity-30",
                        color === 'red' && "bg-red-500",
                        color === 'green' && "bg-green-500",
                        color === 'yellow' && "bg-yellow-500",
                        color === 'blue' && "bg-blue-500"
                    )}
                    style={{ gridColumn: coord.col + 1, gridRow: coord.row + 1 }}
                />
            ))
        ))}

        {/* Render Tokens */}
        {gameState.players.map((player) =>
          player.tokens.map((token, i) => {
            const pos = getTokenPosition(player.color, token.position, token.status, i);
            const isClickable = 
                gameState.currentTurn === player.color && 
                gameState.diceValue !== null &&
                !gameState.isRolling &&
                (
                    (token.status === "base" && gameState.diceValue === 6) ||
                    (token.status === "active" && token.position + gameState.diceValue <= 56)
                );
                
            return (
              <div
                key={token.id}
                className="relative z-10 flex items-center justify-center"
                style={{
                  gridColumn: pos.col + 1,
                  gridRow: pos.row + 1,
                }}
              >
                <Token
                  player={player.color}
                  onClick={() => isClickable && moveToken(token.id)}
                  disabled={!isClickable}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
