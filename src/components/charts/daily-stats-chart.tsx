"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"
import { useScopedI18n } from "@/locales/client"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData {
  attempt: number
  winPercentage: number
  gameCount: number
  isUserAttempt: boolean
}

interface DailyStatsChartProps {
  data: ChartData[]
  totalGames: number
  userAttempt?: number
}



export function DailyStatsChart({ data, totalGames, userAttempt }: DailyStatsChartProps) {
  const t = useScopedI18n("daily")
  const isMobile = useIsMobile()
  const [activeChart, setActiveChart] = React.useState<"winPercentage" | "gameCount">("winPercentage")

  const chartConfig = {
    winPercentage: {
      label: t("winPercentageLabel"),
      color: "var(--chart-1)",
    },
    gameCount: {
      label: t("gameCountLabel"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const total = React.useMemo(
    () => {
      const gamesWon = data.reduce((acc, curr) => acc + curr.gameCount, 0)
      return {
        winPercentage: totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0,
        gameCount: gamesWon,
      }
    },
    [data, totalGames]
  )

  const userAttemptIndex = userAttempt ? userAttempt - 1 : data.findIndex(item => item.isUserAttempt)

  const chartData = data.map((item) => ({
    attempt: item.attempt.toString(),
    attemptLabel: `${t('attempt', { number: item.attempt })}`,
    winPercentage: item.winPercentage,
    gameCount: item.gameCount,
    isUserAttempt: item.isUserAttempt,
    fill: `var(--color-${activeChart})`
  }))


  return (
    <Card className="py-0  ">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>{t('statsTitle', { games: totalGames })}</CardTitle>
          <CardDescription>
            {t('statsDescription')}
          </CardDescription>
        </div>
        <div className="flex">
          {(["winPercentage", "gameCount"] as const).map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {key === "winPercentage"
                    ? `${total[key]}%`
                    : total[key].toLocaleString()
                  }
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="attempt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // On mobile, show just the number. On desktop, show full text
                if (isMobile) {
                  return value
                } else {
                  const item = chartData.find(d => d.attempt === value)
                  return item?.attemptLabel || value
                }
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    const item = chartData.find(d => d.attempt === value)
                    return item?.attemptLabel || value
                  }}
                  formatter={(value) => {
                    if (activeChart === "winPercentage") {
                      return [`${value}% `, chartConfig[activeChart].label]
                    }
                    return [`${value.toLocaleString()} `, chartConfig[activeChart].label]
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
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
      </CardContent>
    </Card>
  )
}