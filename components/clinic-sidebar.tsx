"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  CalendarClock,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Settings,
  Stethoscope,
  User,
  Users,
  Users2,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"

// This would come from your auth system
const userRole = "admin" // Options: "admin", "doctor", "nurse", "patient"

export function ClinicSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [user] = useState({
    name: "Dr. Jane Smith",
    role: userRole,
    avatar: "/placeholder.svg?height=40&width=40",
  })

  // Define navigation items based on user role
  const getNavItems = (role: string) => {
    const items = [
      {
        title: t("common.dashboard"),
        href: "/",
        icon: Home,
        roles: ["admin", "doctor", "nurse", "patient"],
      },
      {
        title: t("common.patients"),
        href: "/patients",
        icon: Users,
        roles: ["admin", "doctor", "nurse"],
      },
      {
        title: t("common.diagnosis"),
        href: "/diagnosis",
        icon: Stethoscope,
        roles: ["admin", "doctor"],
      },
      {
        title: t("common.treatments"),
        href: "/treatments",
        icon: ClipboardList,
        roles: ["admin", "doctor", "nurse"],
      },
      {
        title: t("common.nurseSchedule"),
        href: "/schedule",
        icon: CalendarClock,
        roles: ["admin", "doctor", "nurse"],
      },
      {
        title: t("common.labResults"),
        href: "/lab-results",
        icon: FileText,
        roles: ["admin", "doctor", "nurse", "patient"],
      },
      {
        title: t("common.myProfile"),
        href: "/profile",
        icon: User,
        roles: ["admin", "doctor", "nurse", "patient"],
      },
      {
        title: t("common.settings"),
        href: "/settings",
        icon: Settings,
        roles: ["admin"],
      },
      {
        title: t("common.userManagement"),
        href: "/users",
        icon: Users2,
        roles: ["admin"],
      },
    ]

    return items.filter((item) => item.roles.includes(role))
  }

  const navItems = getNavItems(user.role)

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Activity className="h-6 w-6 text-blue-500" />
          </motion.div>
          <span className="text-xl font-bold">MediCare</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </motion.div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t("common.myProfile")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t("common.myProfile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("common.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("common.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
