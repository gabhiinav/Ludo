import { motion } from "framer-motion";
import { PlayerColor } from "@/app/hooks/useLudoGame";
import { cn } from "@/lib/utils";

interface TokenProps {
  player: PlayerColor;
  onClick?: () => void;
  disabled?: boolean;
}

const colorMap = {
  red: "bg-red-500 border-red-600",
  green: "bg-green-500 border-green-600",
  yellow: "bg-yellow-400 border-yellow-500",
  blue: "bg-blue-500 border-blue-600",
};

export function Token({ player, onClick, disabled }: TokenProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : undefined}
      whileTap={!disabled ? { scale: 0.9 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-6 w-6 rounded-full border-2 shadow-sm transition-opacity",
        colorMap[player],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    />
  );
}
