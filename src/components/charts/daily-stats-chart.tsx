"use client"

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"
import { useScopedI18n } from "@/locales/client"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData {
  attempt: number
  winPercentage: number
  isUserAttempt: boolean
}

interface DailyStatsChartProps {
  data: ChartData[]
  totalGames: number
  userAttempt?: number
}



export function DailyStatsChart({ data, totalGames, userAttempt }: DailyStatsChartProps) {
  const t = useScopedI18n("daily")

  const chartConfig = {
    winPercentage: {
      label: "Win %",
    },
    attempt1: {
      label: "Attempt 1",
      color: userAttempt === 1 ? "var(--chart-2)" : "var(--chart-3)",
    },
    attempt2: {
      label: "Attempt 2",
      color: userAttempt === 2 ? "var(--chart-2)" : "var(--chart-3)",
    },
    attempt3: {
      label: "Attempt 3",
      color: userAttempt === 3 ? "var(--chart-2)" : "var(--chart-3)",
    },
    attempt4: {
      label: "Attempt 4",
      color: userAttempt === 4 ? "var(--chart-2)" : "var(--chart-3)",
    },
    attempt5: {
      label: "Attempt 5",
      color: userAttempt === 5 ? "var(--chart-2)" : "var(--chart-3)",
    },
  } satisfies ChartConfig

  const userAttemptIndex = userAttempt ? userAttempt - 1 : data.findIndex(item => item.isUserAttempt)

  const chartData = data.map((item) => ({
    attempt: `attempt${item.attempt}`,
    winPercentage: item.winPercentage,
    isUserAttempt: item.isUserAttempt,
    fill: `var(--color-attempt${item.attempt})`
  }))


  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="attempt"
          tickLine={false}
          tickMargin={5}
          axisLine={false}
          tick={{ fontSize: 12, className: 'text-xs sm:text-sm' }}
          tickFormatter={(value) => {
            const attemptNum = value.replace('attempt', '')
            // On mobile, show just the number. On desktop, show full text
            return window.innerWidth < 640 ? attemptNum : t('attempt', { number: attemptNum })
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="winPercentage"
          strokeWidth={2}
          radius={8}
          activeIndex={userAttemptIndex >= 0 ? userAttemptIndex : undefined}
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fillOpacity={0.8}
                stroke={props.payload.fill}
                strokeDasharray={4}
                strokeDashoffset={4}
              />
            )
          }}
        />
      </BarChart>
    </ChartContainer>
  )
}