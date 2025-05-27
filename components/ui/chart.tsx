import * as React from "react"

import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("w-full rounded-md border", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("relative", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "pointer-events-none absolute z-50 rounded-md border bg-popover p-2 text-sm shadow-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
ChartTooltip.displayName = "ChartTooltip"

interface ChartTooltipContentProps {
  label: string
  content: {
    label: string
    value: string | number
  }[]
}

const ChartTooltipContent = ({ label, content }: ChartTooltipContentProps) => {
  return (
    <div className="space-y-1">
      <div className="font-bold">{label}</div>
      {content.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-muted-foreground">{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex items-center space-x-2", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps {
  name: string
  color: string
}

const ChartLegendItem = ({ name, color }: ChartLegendItemProps) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-muted-foreground">{name}</span>
    </div>
  )
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }
