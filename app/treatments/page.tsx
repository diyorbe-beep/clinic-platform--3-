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
import { CalendarIcon, Plus, Search } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

// Sample treatment templates
const treatmentTemplates = [
  {
    id: "T001",
    name: "Hypertension Management",
    description: "Standard protocol for managing hypertension",
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily" },
    ],
  },
  {
    id: "T002",
    name: "Type 2 Diabetes Management",
    description: "Protocol for managing Type 2 Diabetes",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Glipizide", dosage: "5mg", frequency: "Once daily before breakfast" },
    ],
  },
  {
    id: "T003",
    name: "Seasonal Allergies",
    description: "Treatment for seasonal allergic rhinitis",
    medications: [
      { name: "Cetirizine", dosage: "10mg", frequency: "Once daily" },
      { name: "Fluticasone Nasal Spray", dosage: "50mcg", frequency: "1 spray per nostril daily" },
    ],
  },
]

// Sample active treatments
const activePatientTreatments = [
  {
    id: "PT001",
    patientId: "P001",
    treatmentName: "Hypertension Management",
    startDate: "2023-05-01",
    endDate: "2023-08-01",
    status: "Active",
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily" },
    ],
    doctor: "Dr. Smith",
  },
  {
    id: "PT002",
    patientId: "P003",
    treatmentName: "Type 2 Diabetes Management",
    startDate: "2023-04-15",
    endDate: "2023-07-15",
    status: "Active",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Glipizide", dosage: "5mg", frequency: "Once daily before breakfast" },
    ],
    doctor: "Dr. Johnson",
  },
]

export default function TreatmentsPage() {
  const { toast } = useToast()
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [customTreatment, setCustomTreatment] = useState("")
  const [medications, setMedications] = useState<Array<{ name: string; dosage: string; frequency: string }>>([
    { name: "", dosage: "", frequency: "" },
  ])

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "" }])
  }

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setMedications(updatedMedications)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = treatmentTemplates.find((t) => t.id === templateId)
    if (template) {
      setCustomTreatment(template.description)
      setMedications(template.medications)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || !startDate || !customTreatment) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would save the treatment to your backend
    toast({
      title: "Treatment plan added",
      description: `Treatment plan for ${patients.find((p) => p.id === selectedPatient)?.name} has been recorded.`,
    })

    // Reset form
    setSelectedTemplate(null)
    setCustomTreatment("")
    setMedications([{ name: "", dosage: "", frequency: "" }])
    setEndDate(undefined)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Treatments & Medications</h2>
      </div>

      <Tabs defaultValue="add-treatment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="add-treatment">Add Treatment</TabsTrigger>
          <TabsTrigger value="active-treatments">Active Treatments</TabsTrigger>
        </TabsList>

        <TabsContent value="add-treatment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Patient</CardTitle>
                <CardDescription>Search and select a patient to add a treatment plan</CardDescription>
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
                <CardTitle>Treatment Templates</CardTitle>
                <CardDescription>Select a template or create a custom treatment plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {treatmentTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedTemplate === template.id
                          ? "bg-primary/10 border border-primary/20"
                          : "border hover:bg-muted"
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                      <div className="mt-2 text-xs">
                        <span className="font-medium">Medications: </span>
                        {template.medications.map((med) => med.name).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan Details</CardTitle>
              <CardDescription>
                {selectedTemplate
                  ? `Using template: ${treatmentTemplates.find((t) => t.id === selectedTemplate)?.name}`
                  : "Create a custom treatment plan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${
                            !startDate ? "text-muted-foreground" : ""
                          }`}
                        >
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${
                            !endDate ? "text-muted-foreground" : ""
                          }`}
                        >
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => (startDate ? date < startDate : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatmentDescription">Treatment Description</Label>
                  <Textarea
                    id="treatmentDescription"
                    placeholder="Enter detailed description of the treatment plan"
                    className="min-h-[100px]"
                    value={customTreatment}
                    onChange={(e) => setCustomTreatment(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Medications</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddMedication}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add Medication
                    </Button>
                  </div>

                  {medications.map((medication, index) => (
                    <div key={index} className="grid gap-2 md:grid-cols-3 border p-3 rounded-md">
                      <div className="space-y-1">
                        <Label htmlFor={`medication-${index}`}>Medication</Label>
                        <Input
                          id={`medication-${index}`}
                          placeholder="Medication name"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                        <Input
                          id={`dosage-${index}`}
                          placeholder="e.g., 10mg"
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                        <Input
                          id={`frequency-${index}`}
                          placeholder="e.g., Twice daily"
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full" disabled={!selectedPatient || !startDate || !customTreatment}>
                  Add Treatment Plan
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-treatments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Treatment Plans</CardTitle>
              <CardDescription>View and manage active treatment plans for all patients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePatientTreatments.map((treatment) => {
                    const patient = patients.find((p) => p.id === treatment.patientId)
                    return (
                      <TableRow key={treatment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={patient?.avatar || "/placeholder.svg"} alt={patient?.name} />
                              <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>{patient?.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{treatment.treatmentName}</TableCell>
                        <TableCell>
                          {treatment.startDate} to {treatment.endDate}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {treatment.medications.map((med, index) => (
                              <div key={index} className="text-xs">
                                <span className="font-medium">{med.name}</span>: {med.dosage}, {med.frequency}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{treatment.doctor}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            {treatment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
