"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Sample nurse data
const nurses = [
  {
    id: "N001",
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "N002",
    name: "Michael Davis",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "N003",
    name: "Jessica Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Sample schedule data
const generateScheduleData = () => {
  const today = new Date()
  return [
    {
      id: "S001",
      patientId: "P001",
      patientName: "John Doe",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      treatmentName: "Blood Pressure Monitoring",
      time: "09:00 AM",
      date: format(today, "yyyy-MM-dd"),
      nurseId: "N001",
      status: "Pending",
      notes: "Check blood pressure and record readings",
    },
    {
      id: "S002",
      patientId: "P002",
      patientName: "Sarah Johnson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      treatmentName: "Medication Administration",
      time: "10:30 AM",
      date: format(today, "yyyy-MM-dd"),
      nurseId: "N001",
      status: "Completed",
      notes: "Administer insulin injection",
    },
    {
      id: "S003",
      patientId: "P003",
      patientName: "Michael Brown",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      treatmentName: "Wound Dressing",
      time: "11:45 AM",
      date: format(today, "yyyy-MM-dd"),
      nurseId: "N002",
      status: "Pending",
      notes: "Change dressing on surgical wound",
    },
    {
      id: "S004",
      patientId: "P004",
      patientName: "Emily Wilson",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      treatmentName: "IV Therapy",
      time: "02:15 PM",
      date: format(today, "yyyy-MM-dd"),
      nurseId: "N003",
      status: "Pending",
      notes: "Administer IV antibiotics",
    },
    {
      id: "S005",
      patientId: "P005",
      patientName: "Robert Garcia",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      treatmentName: "Physical Assessment",
      time: "03:30 PM",
      date: format(today, "yyyy-MM-dd"),
      nurseId: "N002",
      status: "Pending",
      notes: "Complete full physical assessment",
    },
    {
      id: "S006",
      patientId: "P001",
      patientName: "John Doe",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      treatmentName: "Blood Pressure Monitoring",
      time: "09:00 AM",
      date: format(addDays(today, 1), "yyyy-MM-dd"),
      nurseId: "N001",
      status: "Pending",
      notes: "Check blood pressure and record readings",
    },
    {
      id: "S007",
      patientId: "P003",
      patientName: "Michael Brown",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      treatmentName: "Wound Dressing",
      time: "11:45 AM",
      date: format(addDays(today, 1), "yyyy-MM-dd"),
      nurseId: "N002",
      status: "Pending",
      notes: "Change dressing on surgical wound",
    },
  ]
}

export default function SchedulePage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [selectedNurse, setSelectedNurse] = useState<string>("all")
  const [scheduleData, setScheduleData] = useState(generateScheduleData())

  const filteredSchedule = scheduleData.filter((item) => {
    const dateMatches = item.date === format(date, "yyyy-MM-dd")
    const nurseMatches = selectedNurse === "all" || item.nurseId === selectedNurse
    return dateMatches && nurseMatches
  })

  const handleStatusChange = (scheduleId: string, completed: boolean) => {
    setScheduleData(
      scheduleData.map((item) =>
        item.id === scheduleId ? { ...item, status: completed ? "Completed" : "Pending" } : item,
      ),
    )

    const item = scheduleData.find((item) => item.id === scheduleId)

    if (completed) {
      toast({
        title: "Treatment marked as completed",
        description: `${item?.treatmentName} for ${item?.patientName} has been marked as completed.`,
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Nurse Schedule</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view the schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filter</CardTitle>
              <CardDescription>Filter schedule by nurse</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedNurse} onValueChange={setSelectedNurse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select nurse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nurses</SelectItem>
                  {nurses.map((nurse) => (
                    <SelectItem key={nurse.id} value={nurse.id}>
                      {nurse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 space-y-2">
                {nurses.map((nurse) => (
                  <div key={nurse.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={nurse.avatar || "/placeholder.svg"} alt={nurse.name} />
                      <AvatarFallback>{nurse.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">{nurse.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Treatment Schedule</CardTitle>
              <CardDescription>
                Schedule for {format(date, "MMMM d, yyyy")}
                {selectedNurse !== "all" && ` • ${nurses.find((n) => n.id === selectedNurse)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSchedule.length === 0 ? (
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-muted-foreground">No treatments scheduled for this date</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Nurse</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedule.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={schedule.patientAvatar || "/placeholder.svg"}
                                alt={schedule.patientName}
                              />
                              <AvatarFallback>{schedule.patientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>{schedule.patientName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{schedule.treatmentName}</TableCell>
                        <TableCell>{nurses.find((n) => n.id === schedule.nurseId)?.name}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={schedule.notes}>
                            {schedule.notes}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={schedule.status === "Completed" ? "outline" : "secondary"}
                            className={schedule.status === "Completed" ? "border-green-500 text-green-500" : ""}
                          >
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`complete-${schedule.id}`}
                              checked={schedule.status === "Completed"}
                              onCheckedChange={(checked) => handleStatusChange(schedule.id, checked as boolean)}
                            />
                            <Label htmlFor={`complete-${schedule.id}`}>Mark Complete</Label>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
