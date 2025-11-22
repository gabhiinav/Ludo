import { useState, useCallback, useEffect } from "react";

export type PlayerColor = "red" | "green" | "yellow" | "blue";
export type GameStatus = "WAITING" | "PLAYING" | "FINISHED";

export interface Token {
  id: string;
  player: PlayerColor;
  position: number; // -1: base, 0-51: main path, 52-57: home stretch, 58: home
  status: "base" | "active" | "home";
}

export interface Player {
  color: PlayerColor;
  tokens: Token[];
  hasFinished: boolean;
}

interface GameState {
  players: Player[];
  currentTurn: PlayerColor;
  diceValue: number | null;
  gameStatus: GameStatus;
  winner: PlayerColor | null;
  isRolling: boolean;
}

const INITIAL_PLAYERS: Player[] = [
  {
    color: "red",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `red-${i}`,
      player: "red",
      position: -1,
      status: "base",
    })),
    hasFinished: false,
  },
  {
    color: "green",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `green-${i}`,
      player: "green",
      position: -1,
      status: "base",
    })),
    hasFinished: false,
  },
  {
    color: "yellow",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `yellow-${i}`,
      player: "yellow",
      position: -1,
      status: "base",
    })),
    hasFinished: false,
  },
  {
    color: "blue",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `blue-${i}`,
      player: "blue",
      position: -1,
      status: "base",
    })),
    hasFinished: false,
  },
];

const TURN_ORDER: PlayerColor[] = ["red", "green", "yellow", "blue"];

export function useLudoGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: INITIAL_PLAYERS,
    currentTurn: "red",
    diceValue: null,
    gameStatus: "WAITING",
    winner: null,
    isRolling: false,
  });

  const checkValidMoves = useCallback((player: Player, diceRoll: number) => {
    return player.tokens.some((token) => {
      if (token.status === "base") return diceRoll === 6;
      if (token.status === "active") return token.position + diceRoll <= 56;
      return false;
    });
  }, []);

  const rollDice = useCallback(() => {
    if (gameState.isRolling || gameState.diceValue !== null) return;

    setGameState((prev) => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      
      setGameState((prev) => {
        const currentPlayer = prev.players.find(p => p.color === prev.currentTurn)!;
        const hasMoves = checkValidMoves(currentPlayer, newValue);
        
        console.log("Rolled:", newValue, "Player:", prev.currentTurn, "HasMoves:", hasMoves);

        if (!hasMoves) {
            console.log("No moves, auto-switching in 1s");
            // Auto switch turn after a short delay if no moves
            setTimeout(() => {
                 setGameState(currentState => {
                     const currentIndex = TURN_ORDER.indexOf(currentState.currentTurn);
                     const nextIndex = (currentIndex + 1) % 4;
                     return {
                         ...currentState,
                         currentTurn: TURN_ORDER[nextIndex],
                         diceValue: null
                     };
                 });
            }, 1000);
        }

        return {
          ...prev,
          diceValue: newValue,
          isRolling: false,
        };
      });
    }, 1000);
  }, [gameState.isRolling, gameState.diceValue, checkValidMoves]);

  const switchTurn = useCallback(() => {
    setGameState((prev) => {
      const currentIndex = TURN_ORDER.indexOf(prev.currentTurn);
      const nextIndex = (currentIndex + 1) % 4;
      return {
        ...prev,
        currentTurn: TURN_ORDER[nextIndex],
        diceValue: null,
      };
    });
  }, []);

  const moveToken = useCallback((tokenId: string) => {
    const [playerColor, tokenIndex] = tokenId.split("-");
    console.log("Attempting move:", tokenId, "CurrentTurn:", gameState.currentTurn, "Dice:", gameState.diceValue);

    if (gameState.currentTurn !== playerColor) {
        console.log("Not player's turn");
        return;
    }
    if (!gameState.diceValue) {
        console.log("No dice value");
        return;
    }

    const playerIdx = gameState.players.findIndex((p) => p.color === playerColor);
    const player = gameState.players[playerIdx];
    const token = player.tokens[parseInt(tokenIndex)];

    let newPosition = token.position;
    let newStatus = token.status;

    // Rule: Need 6 to leave base
    if (token.status === "base") {
      if (gameState.diceValue === 6) {
        newPosition = 0;
        newStatus = "active";
      } else {
        return; // Cannot move
      }
    } else if (token.status === "active") {
      newPosition += gameState.diceValue;

      // Check if reached home
      if (newPosition >= 56) {
         if (newPosition === 56) {
             newStatus = "home";
         } else {
             if (newPosition > 56) return; 
         }
      }
    }

    // Update state
    setGameState((prev) => {
      const newPlayers = [...prev.players];
      
      // Handle Capturing
      // Calculate global position of the moved token
      // Only capture if on main path (not home stretch or base)
      // And not on safe spots (optional, skipping safe spots for now for simplicity, or added later)
      
      // We need to know the global index to check for collision
      // This logic is duplicated from Board.tsx, ideally should be shared or calculated here
      // Let's just implement basic capturing: if land on opponent token on main path
      
      // Simplified capture logic:
      // We need to calculate global index for collision detection
      // But we don't have the easy mapping here without importing utils.
      // Let's skip complex capture for this iteration to ensure basic flow works.
      // Or we can import the utils.
      
      newPlayers[playerIdx] = {
        ...player,
        tokens: player.tokens.map((t) =>
          t.id === tokenId ? { ...t, position: newPosition, status: newStatus } : t
        ),
      };
      
      // Check win condition
      if (newPlayers[playerIdx].tokens.every(t => t.status === "home")) {
          newPlayers[playerIdx].hasFinished = true;
          return {
              ...prev,
              players: newPlayers,
              winner: playerColor as PlayerColor,
              gameStatus: "FINISHED",
              diceValue: null
          }
      }

      return {
        ...prev,
        players: newPlayers,
        diceValue: null, // Reset dice after move
      };
    });

    // Switch turn if not 6
    if (gameState.diceValue !== 6) {
      switchTurn();
    }
  }, [gameState, switchTurn]);

  const resetGame = useCallback(() => {
    setGameState({
      players: INITIAL_PLAYERS,
      currentTurn: "red",
      diceValue: null,
      gameStatus: "WAITING",
      winner: null,
      isRolling: false,
    });
  }, []);

  return {
    gameState,
    rollDice,
    moveToken,
    resetGame,
  };
}
