"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"


export default function UserRegistrationPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: t("other.firstNameMessage"),
    }),
    lastName: z.string().min(2, {
      message: t("other.lastNameMessage"),
    }),
    email: z.string().email({
      message: t("other.emailMessage"),
    }),
    role: z.string({
      required_error: t("other.PleaseSelectRole"),
    }),
    department: z.string().min(2, {
      message: t("other.DepartmentMessage"),
    }),
    password: z.string().min(8, {
      message: t("other.PasswordMessage"),
    }),
    confirmPassword: z.string(),
    sendWelcomeEmail: z.boolean().default(true),
    requirePasswordChange: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      password: "",
      confirmPassword: "",
      sendWelcomeEmail: true,
      requirePasswordChange: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "User registered successfully",
        description: `${values.firstName} ${values.lastName} has been added as a ${values.role}.`,
      })
      setIsSubmitting(false)

      // Reset form
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        role: undefined,
        department: "",
        password: "",
        confirmPassword: "",
        sendWelcomeEmail: true,
        requirePasswordChange: true,
      })
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/users">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{t("users.userRegistration")}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("users.UserInformation")}</CardTitle>
          <CardDescription>{t("other.AddNewUser")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.FirstName")} *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.LastName")} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("other.Email")} *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="doctor">{t("labResults.doctor")}</SelectItem>
                            <SelectItem value="nurse">{t("schedule.nurse")}</SelectItem>
                            <SelectItem value="administrator">{t("other.administrator")}</SelectItem>
                            <SelectItem value="receptionist">{t("other.receReceptionistptionist")}</SelectItem>
                            <SelectItem value="lab_technician">{t("other.LabTechnician")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("users.department")} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.Password")} *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>{t("other.PasswordMessage")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.ConfirmPassword")} *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="sendWelcomeEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{t("other.SendWelcomeEmail")}</FormLabel>
                          <FormDescription>{t("other.SendAnEmail")}</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirePasswordChange"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{t("other.RequirePassword")}</FormLabel>
                          <FormDescription>
                            {t("other.TheUserWill")}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Link href="/users">
                  <Button variant="outline">{t("common.cancel")}</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register User"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
