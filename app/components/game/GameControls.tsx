import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Dice } from "./Dice";
import { useLudoGame } from "@/app/hooks/useLudoGame";

interface GameControlsProps {
  game: ReturnType<typeof useLudoGame>;
}

export function GameControls({ game }: GameControlsProps) {
  const { gameState, rollDice, resetGame, switchTurn } = game;

  if (gameState.winner) {
    return (
      <Card className="flex flex-col items-center gap-6 p-6">
        <h2 className="text-2xl font-bold text-green-600">
          {gameState.winner.toUpperCase()} WINS!
        </h2>
        <Button onClick={resetGame} size="lg">
          Play Again
        </Button>
      </Card>
    );
  }

  const hasValidMoves = gameState.diceValue
    ? gameState.players
        .find((p) => p.color === gameState.currentTurn)
        ?.tokens.some(
          (t) =>
            (t.status === "base" && gameState.diceValue === 6) ||
            (t.status === "active" &&
              gameState.diceValue !== null &&
              t.position + gameState.diceValue <= 56)
        )
    : false;

  return (
    <Card className="flex flex-col items-center gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-lg font-semibold">Current Turn</h2>
        <div className="flex items-center gap-2">
          <div
            className={`h-4 w-4 rounded-full bg-${gameState.currentTurn === "yellow" ? "yellow-400" : gameState.currentTurn + "-500"}`}
          />
          <span className="capitalize">{gameState.currentTurn}</span>
        </div>
      </div>

      <Dice
        value={gameState.diceValue}
        isRolling={gameState.isRolling}
        onClick={rollDice}
        disabled={gameState.diceValue !== null || gameState.isRolling}
      />

      {gameState.diceValue && !hasValidMoves && (
        <Button onClick={switchTurn} variant="outline" className="w-full">
          Pass Turn
        </Button>
      )}

      <div className="text-sm text-zinc-500">
        {gameState.diceValue
          ? hasValidMoves
            ? "Select a token to move"
            : "No valid moves"
          : "Roll the dice to start"}
      </div>
      
      <Button variant="ghost" size="sm" onClick={resetGame} className="mt-4 text-zinc-400 hover:text-zinc-600">
          Reset Game
      </Button>
    </Card>
  );
}
