import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CellProps {
  color?: "red" | "green" | "yellow" | "blue" | "white" | "safe";
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

const bgColors = {
  red: "bg-red-100 dark:bg-red-900/20",
  green: "bg-green-100 dark:bg-green-900/20",
  yellow: "bg-yellow-100 dark:bg-yellow-900/20",
  blue: "bg-blue-100 dark:bg-blue-900/20",
  white: "bg-white dark:bg-zinc-900",
  safe: "bg-zinc-200 dark:bg-zinc-800", // Grey for safe spots
};

export function Cell({ color = "white", children, className, onClick }: CellProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex h-full w-full items-center justify-center border border-zinc-200 dark:border-zinc-800",
        bgColors[color],
        className
      )}
    >
      {children}
    </div>
  );
}
