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
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search, UserCog } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Sample user data


export default function UsersPage() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

const users = [
  {
    id: "U001",
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    role: t("labResults.doctor"),
    department: "Cardiology",
    status: t("common.active"),
    lastLogin: "2023-05-15 09:45 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U002",
    name: "Dr. Michael Johnson",
    email: "michael.johnson@example.com",
    role: t("labResults.doctor"),
    department: "Neurology",
    status: t("common.active"),
    lastLogin: "2023-05-14 02:30 PM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U003",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: t("schedule.nurse"),
    department: "General",
    status: t("common.active"),
    lastLogin: "2023-05-15 08:15 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U004",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role:t("labResults.doctor"),
    department: "Pediatrics",
    status: t("common.active"),
    lastLogin: "2023-05-15 10:20 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U005",
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    role: t("other.administrator"),
    department: "Administration",
    status: t("common.active"),
    lastLogin: "2023-05-15 07:30 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U006",
    name: "David Brown",
    email: "david.brown@example.com",
    role: t("labResults.doctor"),
    department: "Orthopedics",
    status: t("common.inactive"),
    lastLogin: "2023-05-10 11:45 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U007",
    name: "Jessica Lee",
    email: "jessica.lee@example.com",
    role:t("labResults.doctor"),
    department: "Emergency",
    status: t("common.active"),
    lastLogin: "2023-05-15 06:50 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "U008",
    name: "Thomas Garcia",
    email: "thomas.garcia@example.com",
    role: t("patients.patient"),
    department: "N/A",
    status: t("common.active"),
    lastLogin: "2023-05-14 04:15 PM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

  // Only show animations after mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  if (!mounted) {
    return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">Loading...</div>
  }

  return (
    <motion.div
      className="flex-1 space-y-4 p-4 md:p-8 pt-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("common.userManagement")}</h2>
        <div className="flex items-center gap-2">
          <Link href="/users/register">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("users.addUser")}
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-2 md:w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`${t("common.search")} ${t("users.userList").toLowerCase()}...`}
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            {t("users.allUsers")}
          </Button>
          <Button variant="outline" size="sm">
            {t("users.doctors")}
          </Button>
          <Button variant="outline" size="sm">
            {t("users.nurses")}
          </Button>
          <Button variant="outline" size="sm">
            {t("users.administrators")}
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>{t("users.role")}</TableHead>
              <TableHead>{t("users.department")}</TableHead>
              <TableHead>{t("users.lastLogin")}</TableHead>
              <TableHead>{t("users.status")}</TableHead>
              <TableHead className="text-right">{t("users.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 12 }}
                className="border-b"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
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
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>{t("common.edit")} {t("users.user")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>{t("users.resetPassword")}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === t("common.active") ? (
                        <DropdownMenuItem className="text-destructive">{t("users.deactivateUser")}</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>{t("users.activateUser")}</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("other.Showing")} <strong>1-8</strong> of <strong>24</strong> {t("users.user")}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t("users.PreviousPage")}</span>
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t("users.NextPage")}</span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const getRoleProps = (role: string) => {
    switch (role) {
      case "Doctor":
      case "Врач":
      case "Shifokor":
        return { variant: "outline" as const, className: "border-blue-500 text-blue-500" }
      case "Nurse":
      case "Медсестра":
      case "Hamshira":
        return { variant: "outline" as const, className: "border-green-500 text-green-500" }
      case "Administrator":
      case "Администраторы":
      case "administrator":
        return { variant: "outline" as const, className: "border-purple-500 text-purple-500" }
      case "Patient":
      case "Пациент":
      case "Bemor":
        return { variant: "outline" as const, className: "border-yellow-500 text-yellow-500" }
      default:
        return { variant: "secondary" as const }
    }
  }

  const { variant, className } = getRoleProps(role)

  return (
    <Badge variant={variant} className={className}>
      {role}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage()
  return (
    <Badge
      variant={status === t("common.active") ? "outline" : "secondary"}
      className={status === t("common.active") ? "border-green-500 text-green-500" : ""}
    >
      {status}
    </Badge>
  )
}
