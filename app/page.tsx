"use client";

import { Board } from "./components/game/Board";
import { GameControls } from "./components/game/GameControls";
import { useLudoGame } from "./hooks/useLudoGame";

export default function Home() {
  const game = useLudoGame();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-4 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Ludo
        </h1>
      </div>

      <div className="flex w-full max-w-5xl flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-center">
        <div className="flex-1">
          <Board game={game} />
        </div>
        
        <div className="w-full lg:w-80">
          <GameControls game={game} />
        </div>
      </div>
    </main>
  );
}
