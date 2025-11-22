import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function Dice({ value, isRolling, onClick, disabled }: DiceProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-20 w-20 items-center justify-center rounded-xl border-2 bg-white shadow-sm transition-colors dark:bg-zinc-900",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600",
        isRolling && "animate-spin"
      )}
    >
      {value ? (
        <span className="text-4xl font-bold">{value}</span>
      ) : (
        <span className="text-sm font-medium text-zinc-500">Roll</span>
      )}
    </motion.button>
  );
}
