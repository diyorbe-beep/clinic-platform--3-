"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Eye, FileText, Search, Upload } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useLanguageChange } from "@/hooks/use-language-change"

export default function LabResultsPage() {
  const { t } = useLanguage()
  useLanguageChange()
  const { toast } = useToast()
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [testName, setTestName] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Sample patient data
  const patients = [
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      gender: t("other.Male"),
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

  // Sample lab results
  const labResults = [
    {
      id: "L001",
      patientId: "P001",
      testName: "Complete Blood Count (CBC)",
      date: "2023-05-10",
      resultDate: "2023-05-12",
      status: "Completed",
      doctor: "Dr. Smith",
      fileUrl: "#",
      notes: "Normal results. No significant abnormalities detected.",
    },
    {
      id: "L002",
      patientId: "P001",
      testName: "Lipid Panel",
      date: "2023-05-10",
      resultDate: "2023-05-12",
      status: "Completed",
      doctor: "Dr. Smith",
      fileUrl: "#",
      notes: "Cholesterol levels slightly elevated. Recommend dietary changes.",
    },
    {
      id: "L003",
      patientId: "P002",
      testName: "Thyroid Function Test",
      date: "2023-05-15",
      resultDate: "2023-05-17",
      status: "Completed",
      doctor: "Dr. Johnson",
      fileUrl: "#",
      notes: "TSH levels within normal range.",
    },
    {
      id: "L004",
      patientId: "P003",
      testName: "Comprehensive Metabolic Panel",
      date: "2023-05-08",
      resultDate: null,
      status: "Pending",
      doctor: "Dr. Wilson",
      fileUrl: null,
      notes: "Awaiting results from the laboratory.",
    },
    {
      id: "L005",
      patientId: "P003",
      testName: "Hemoglobin A1C",
      date: "2023-05-08",
      resultDate: "2023-05-10",
      status: "Completed",
      doctor: "Dr. Wilson",
      fileUrl: "#",
      notes: "HbA1c at 7.2%. Indicates need for better glucose control.",
    },
  ]

  const patientLabResults = selectedPatient
    ? labResults.filter((result) => result.patientId === selectedPatient)
    : labResults

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || !date || !testName || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload a file.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would upload the file and save the lab result to your backend
    toast({
      title: "Lab result uploaded",
      description: `Lab result for ${patients.find((p) => p.id === selectedPatient)?.name} has been uploaded.`,
    })

    // Reset form
    setTestName("")
    setNotes("")
    setSelectedFile(null)

    // Reset the file input
    const fileInput = document.getElementById("lab-file") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Lab Results</h2>
      </div>

      <Tabs defaultValue="view-results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="view-results">View Results</TabsTrigger>
          <TabsTrigger value="upload-results">Upload Results</TabsTrigger>
        </TabsList>

        <TabsContent value="view-results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
              <CardDescription>View and manage patient lab results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 md:w-1/3">
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search lab results..." className="w-full pl-8" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={selectedPatient || "all"}
                    onValueChange={(value) => setSelectedPatient(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    All Results
                  </Button>
                  <Button variant="outline" size="sm">
                    Completed
                  </Button>
                  <Button variant="outline" size="sm">
                    Pending
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientLabResults.map((result) => {
                      const patient = patients.find((p) => p.id === result.patientId)
                      return (
                        <TableRow key={result.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={patient?.avatar || "/placeholder.svg"} alt={patient?.name} />
                                <AvatarFallback>{patient?.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>{patient?.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{result.testName}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>Ordered: {result.date}</span>
                              {result.resultDate && (
                                <span className="text-xs text-muted-foreground">Results: {result.resultDate}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={result.status === "Completed" ? "outline" : "secondary"}
                              className={result.status === "Completed" ? "border-green-500 text-green-500" : ""}
                            >
                              {result.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.doctor}</TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate" title={result.notes}>
                              {result.notes}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {result.fileUrl && (
                                <>
                                  <Button variant="outline" size="icon" title="View">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" title="Download">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload-results" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Patient</CardTitle>
                <CardDescription>Search and select a patient to upload lab results</CardDescription>
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
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${selectedPatient === patient.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
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
                          {patient.age} {t("common.years")} • {patient.gender} • ID: {patient.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Lab Result</CardTitle>
                <CardDescription>Upload lab result files (PDF, JPG, PNG)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="testName">Test Name</Label>
                    <Input
                      id="testName"
                      placeholder="e.g., Complete Blood Count"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Test Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""
                            }`}
                        >
                          {date ? format(date, "PPP") : <span>{t("other.PickDate")}</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any notes about the lab result"
                      className="min-h-[100px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lab-file">Upload File</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="lab-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (MAX. 10MB)</p>
                        </div>
                        <input
                          id="lab-file"
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {selectedFile && (
                      <div className="flex items-center gap-2 p-2 mt-2 border rounded-md">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{selectedFile.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedPatient || !date || !testName || !selectedFile}
                  >
                    Upload Lab Result
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
