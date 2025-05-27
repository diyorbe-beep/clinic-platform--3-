"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useLanguageChange } from "@/hooks/use-language-change"


export function UpcomingAppointments() {
  const { t } = useLanguage()
  // Force re-render when language changes
  useLanguageChange()

const appointments = [
  {
    id: "1",
    patientName: "John Doe",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    time: "10:00 AM",
    date: t("common.today"),
    type: t("other.CheckUp"),
    duration: "30 min",
  },
  {
    id: "2",
    patientName: "Sarah Johnson",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    time: "11:30 AM",
    date: t("common.today"),
    type: t("other.FollowUp"),
    duration: "45 min",
  },
  {
    id: "3",
    patientName: "Michael Brown",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    time: "2:15 PM",
    date: t("common.today"),
    type: t("other.Consultation"),
    duration: "60 min",
  },
  {
    id: "4",
    patientName: "Emily Wilson",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    time: "9:00 AM",
    date: t("other.tomorrow"),
    type: t("other.CheckUp"),
    duration: "30 min",
  },
  {
    id: "5",
    patientName: "Robert Garcia",
    patientAvatar: "/placeholder.svg?height=32&width=32",
    time: "10:45 AM",
    date: t("other.tomorrow"),
    type: t("other.LabReview"),
    duration: "45 min",
  },
]

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] lg:grid-cols-[1fr_1fr_1fr_1fr_auto] p-4 text-sm font-medium">
          <div>Patient</div>
          <div className="hidden md:block">{t("schedule.time")}</div>
          <div className="hidden lg:block">{t("labResults.date")}</div>
          <div>{t("other.type")}</div>
          <div className="text-right">{t("other.Start")}</div>
        </div>
        <div className="divide-y">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] lg:grid-cols-[1fr_1fr_1fr_1fr_auto] items-center p-4 text-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} alt={appointment.patientName} />
                  <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{appointment.patientName}</div>
                  <div className="text-xs text-muted-foreground md:hidden">
                    {appointment.time}, {appointment.date}
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.time}</span>
                <span className="text-xs text-muted-foreground">({appointment.duration})</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.date}</span>
              </div>
              <div>
                <Badge variant="outline">{appointment.type}</Badge>
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline">
                  {t("other.View")}
                </Button>
                <Button size="sm">{t("other.Start")}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
