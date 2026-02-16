import { cn, getScoreBg } from "@/lib/utils";

interface SeoScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function SeoScoreBadge({ score, size = "md", label }: SeoScoreBadgeProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex items-center justify-center rounded-full border font-bold",
          sizeClasses[size],
          getScoreBg(score)
        )}
      >
        {score}
      </div>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
