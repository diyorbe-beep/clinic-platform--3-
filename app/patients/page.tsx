"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, FileText, MoreHorizontal, Plus, Search, Stethoscope } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useLanguageChange } from "@/hooks/use-language-change"
// Sample patient data


export default function PatientsPage() {
  const { t } = useLanguage()
    useLanguageChange()
const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    gender: t("other.Male"),
    phone: "(555) 123-4567",
    email: "john.doe@example.com",
    lastVisit: "2023-05-15",
    status: t("common.active"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    age: 32,
    gender: t("other.Female"),
    phone: "(555) 234-5678",
    email: "sarah.j@example.com",
    lastVisit: "2023-05-20",
    status: t("patients.critical"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P003",
    name: "Michael Brown",
    age: 58,
    gender: t("other.Male"),
    phone: "(555) 345-6789",
    email: "m.brown@example.com",
    lastVisit: "2023-05-10",
    status: t("common.active"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P004",
    name: "Emily Wilson",
    age: 27,
    gender: t("other.Female"),
    phone: "(555) 456-7890",
    email: "emily.w@example.com",
    lastVisit: "2023-05-05",
    status: t("common.Stable"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P005",
    name: "Robert Garcia",
    age: 63,
    gender: t("other.Male"),
    phone: "(555) 567-8901",
    email: "r.garcia@example.com",
    lastVisit: "2023-04-28",
    status: t("patients.recovering"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P006",
    name: "Jennifer Lee",
    age: 41,
    gender: t("other.Female"),
    phone: "(555) 678-9012",
    email: "j.lee@example.com",
    lastVisit: "2023-05-18",
    status: t("common.active"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P007",
    name: "David Kim",
    age: 36,
    gender: t("other.Male"),
    phone: "(555) 789-0123",
    email: "d.kim@example.com",
    lastVisit: "2023-05-12",
    status: t("common.active"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P008",
    name: "Lisa Chen",
    age: 29,
    gender: t("other.Female"),
    phone: "(555) 890-1234",
    email: "l.chen@example.com",
    lastVisit: "2023-05-08",
    status: t("common.active"),
    avatar: "/placeholder.svg?height=40&width=40",
  },
]
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("common.patients")}</h2>
        <div className="flex items-center gap-2">
          <Link href="/patients/register">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("patients.newPatient")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 md:w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`${t("common.search")} ${t("patients.patientList").toLowerCase()}...`}
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            {t("other.AllPatients")}
          </Button>
          <Button variant="outline" size="sm">
            {t("other.Recent")}
          </Button>
          <Button variant="outline" size="sm">
            {t("other.Critical")}
          </Button>
          <Button variant="outline" size="sm">
            {t("other.Recovering")}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.patients")}</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>{t("patients.contact")}</TableHead>
              <TableHead>{t("patients.lastVisit")}</TableHead>
              <TableHead>{t("users.status")}</TableHead>
              <TableHead className="text-right">{t("users.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {patient.age} {t("patients.years")} • {patient.gender}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.id}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{patient.phone}</div>
                    <div className="text-muted-foreground">{patient.email}</div>
                  </div>
                </TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <StatusBadge status={patient.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t("users.actions")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("users.actions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Stethoscope className="mr-2 h-4 w-4" />
                        <span>{t("other.AddDiagnosis")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>{t("other.ViewRecords")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>{t("common.edit")} Patient</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">{t("common.delete")} Patient</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("other.Showing")} <strong>1-8</strong> {t("other.of")} <strong>100</strong> {t("common .patients")}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
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
