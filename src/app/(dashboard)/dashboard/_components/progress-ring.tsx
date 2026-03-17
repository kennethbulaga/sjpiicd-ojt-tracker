import { cn } from "@/lib/utils"

interface ProgressRingProps {
  hoursCompleted: number
  targetHours: number
}

export function ProgressRing({ hoursCompleted, targetHours }: ProgressRingProps) {
  const percentage = Math.min(100, (hoursCompleted / targetHours) * 100)
  const hoursRemaining = Math.max(0, targetHours - hoursCompleted)

  const size = 192
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const progressColor =
    percentage >= 100 ? "stroke-green-500 dark:stroke-green-400" : "stroke-primary"

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-label={`${Math.round(percentage)}% OJT progress`}
          role="img"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-[stroke-dashoffset] duration-700 ease-out",
              progressColor
            )}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold tracking-tight">
            {percentage >= 100 ? "100" : Math.round(percentage)}%
          </p>
          <p className="text-sm text-muted-foreground">
            {hoursRemaining > 0 ? `${Math.ceil(hoursRemaining)}h left` : "Complete!"}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{Math.floor(hoursCompleted)}</span> / {targetHours} hours
      </p>
    </div>
  )
}
