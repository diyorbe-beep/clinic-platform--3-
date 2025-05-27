"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarClock, ClipboardList, FileText, Users } from "lucide-react"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

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
        staggerChildren: 0.1,
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
    return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{t("common.loading")}</div>
  }

  return (
    <motion.div
      className="flex-1 space-y-4 p-4 md:p-8 pt-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("common.dashboard")}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{t("common.welcome")}, Dr. Smith</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("common.overview")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("common.analytics")}</TabsTrigger>
          <TabsTrigger value="reports">{t("common.reports")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("dashboard.totalPatients")}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+12 {t("dashboard.fromLastMonth")}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("dashboard.activeTreatments")}</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">324</div>
                  <p className="text-xs text-muted-foreground">+4 {t("dashboard.fromYesterday")}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("dashboard.pendingLabResults")}</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">-8 {t("dashboard.fromYesterday")}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("dashboard.todayAppointments")}</CardTitle>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">3 {t("dashboard.remaining")}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7" variants={containerVariants}>
            <motion.div className="col-span-4" variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("dashboard.patientStatistics")}</CardTitle>
                  <CardDescription>{t("dashboard.patientVisits")}</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <DashboardChart />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="col-span-3" variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("dashboard.recentPatients")}</CardTitle>
                  <CardDescription>{t("dashboard.recentlyRegistered")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPatients />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div className="grid gap-4 md:grid-cols-1" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("dashboard.upcomingAppointments")}</CardTitle>
                  <CardDescription>{t("dashboard.scheduleNext24")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingAppointments />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.analyticsTitle")}</CardTitle>
              <CardDescription>{t("dashboard.analyticsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">{t("dashboard.analyticsComingSoon")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.reportsTitle")}</CardTitle>
              <CardDescription>{t("dashboard.reportsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">{t("dashboard.reportsComingSoon")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
