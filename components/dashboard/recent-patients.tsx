"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useLanguageChange } from "@/hooks/use-language-change"

export function RecentPatients() {
  const { t } = useLanguage()
  // Force re-render when language changes
  useLanguageChange()
  const recentPatients = [
    {
      id: "1",
      name: "John Doe",
      age: 45,
      avatar: "/placeholder.svg?height=32&width=32",
      lastVisit: t("common.today"),
      status: t("common.active"),
    },
    {
      id: "2",
      name: "Sarah Johnson",
      age: 32,
      avatar: "/placeholder.svg?height=32&width=32",
      lastVisit: t("common.yesterday"),
      status: t("common.active"),
    },
    {
      id: "3",
      name: "Michael Brown",
      age: 58,
      avatar: "/placeholder.svg?height=32&width=32",
      lastVisit: `2 ${t("common.daysAgo")}`,
      status: t("patients.critical"),
    },
    {
      id: "4",
      name: "Emily Wilson",
      age: 27,
      avatar: "/placeholder.svg?height=32&width=32",
      lastVisit: `3 ${t("common.daysAgo")}`,
      status: t("common.Stable"),
    },
    {
      id: "5",
      name: "Robert Garcia",
      age: 63,
      avatar: "/placeholder.svg?height=32&width=32",
      lastVisit: `1 ${t("common.week")}`,
      status: t("patients.recovering"),
    },
  ]
  
  return (
    <div className="space-y-4">
      {recentPatients.map((patient) => (
        <div key={patient.id} className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{patient.name}</p>
            <p className="text-xs text-muted-foreground">
              {patient.age} {t("patients.years")} • {t("common.lastVisit")}: {patient.lastVisit}
            </p>
          </div>
          <StatusBadge status={patient.status} />
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
const getStatusProps = (status: string) => {
    switch (status) {
      case "Active":
      case "Faol":
      case "Активные":
        return { variant: "outline" as const, className: "border-blue-500 text-blue-500" }
      case "Critical":
      case "Og'ir ahvoldagi":
      case "Критические":
        return { variant: "destructive" as const }
      case "Stable":
      case "Barqaror":
      case "Стабильный":
        return { variant: "outline" as const, className: "border-green-500 text-green-500" }
      case "Recovering":
      case "Tuzalayotgan":
      case "Выздоравливающие":
        return { variant: "outline" as const, className: "border-yellow-500 text-yellow-500" }
      default:
        return { variant: "secondary" as const }
    }
}

  const { variant, className } = getStatusProps(status)

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  )
}
