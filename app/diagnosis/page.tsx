"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Sample patient data
const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P003",
    name: "Michael Brown",
    age: 58,
    gender: "Male",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Sample previous diagnoses
const previousDiagnoses = [
  {
    id: "D001",
    date: "2023-05-10",
    diagnosis: "Hypertension",
    description: "Blood pressure consistently above 140/90 mmHg.",
    doctor: "Dr. Smith",
  },
  {
    id: "D002",
    date: "2023-03-15",
    diagnosis: "Type 2 Diabetes",
    description: "HbA1c levels at 7.2%. Patient advised on diet and exercise.",
    doctor: "Dr. Johnson",
  },
  {
    id: "D003",
    date: "2022-11-22",
    diagnosis: "Seasonal Allergies",
    description: "Rhinitis and itchy eyes. Prescribed antihistamines.",
    doctor: "Dr. Smith",
  },
]

export default function DiagnosisPage() {
  const { toast } = useToast()
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [diagnosis, setDiagnosis] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || !date || !diagnosis || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would save the diagnosis to your backend
    toast({
      title: "Diagnosis added",
      description: `Diagnosis for ${patients.find((p) => p.id === selectedPatient)?.name} has been recorded.`,
    })

    // Reset form
    setDiagnosis("")
    setDescription("")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Diagnosis</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
            <CardDescription>Search and select a patient to add a diagnosis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search patients..." className="pl-8" />
            </div>

            <div className="space-y-2">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                    selectedPatient === patient.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <Avatar>
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {patient.age} years • {patient.gender} • ID: {patient.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Diagnosis</CardTitle>
            <CardDescription>Record a new diagnosis for the selected patient</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Enter diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter detailed description of the diagnosis"
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedPatient || !date || !diagnosis || !description}
              >
                Add Diagnosis
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Diagnoses</CardTitle>
            <CardDescription>
              Medical history for {patients.find((p) => p.id === selectedPatient)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Doctor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previousDiagnoses.map((diagnosis) => (
                  <TableRow key={diagnosis.id}>
                    <TableCell>{diagnosis.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{diagnosis.diagnosis}</Badge>
                    </TableCell>
                    <TableCell>{diagnosis.description}</TableCell>
                    <TableCell>{diagnosis.doctor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
