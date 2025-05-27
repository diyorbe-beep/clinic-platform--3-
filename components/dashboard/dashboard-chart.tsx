"use client"

import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", patients: 120, newPatients: 40 },
  { month: "Feb", patients: 150, newPatients: 45 },
  { month: "Mar", patients: 180, newPatients: 50 },
  { month: "Apr", patients: 200, newPatients: 35 },
  { month: "May", patients: 220, newPatients: 30 },
  { month: "Jun", patients: 250, newPatients: 45 },
  { month: "Jul", patients: 280, newPatients: 55 },
  { month: "Aug", patients: 260, newPatients: 40 },
  { month: "Sep", patients: 290, newPatients: 65 },
  { month: "Oct", patients: 310, newPatients: 50 },
  { month: "Nov", patients: 330, newPatients: 60 },
  { month: "Dec", patients: 350, newPatients: 70 },
]

export function DashboardChart() {
  return (
    <ChartContainer className="h-[300px]">
      <ChartLegend className="mb-4">
        <ChartLegendItem name="Total Visits" color="#0ea5e9" />
        <ChartLegendItem name="New Patients" color="#22c55e" />
      </ChartLegend>
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
            <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent
                      label={`${label}`}
                      content={[
                        {
                          label: "Total Visits",
                          value: payload[0].value,
                        },
                        {
                          label: "New Patients",
                          value: payload[1].value,
                        },
                      ]}
                    />
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="patients"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="newPatients"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}
