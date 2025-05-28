"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import { useLanguage } from "@/contexts/language-context"
import { useLanguageChange } from "@/hooks/use-language-change"


export default function PatientRegistrationPage() {
  const { t } = useLanguage()
  useLanguageChange()
  const { toast } = useToast()
  const [step, setStep] = useState(1)

  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: t("other.firstNameMessage"),
    }),
    lastName: z.string().min(2, {
      message: t("other.lastNameMessage"),
    }),
    dateOfBirth: z.date({
      required_error: t("other.dateOfBirth"),
    }),
    gender: z.string({
      required_error: t("other.genderMessage"),
    }),
    email: z.string().email({
      message: t("other.emailMessage"),
    }),
    phone: z.string().min(10, {
      message: t("other.phoneMessage"),
    }),
    address: z.string().min(5, {
      message: t("other.addressMessage"),
    }),
    city: z.string().min(2, {
      message: t("other.cityMessage"),
    }),
    state: z.string().min(2, {
      message: t("other.stateMessage"),
    }),
    zipCode: z.string().min(5, {
      message: t("other.zipCodeMessage"),
    }),
    emergencyContactName: z.string().min(2, {
      message: t("other.emergencyContactNameMessage"),
    }),
    emergencyContactPhone: z.string().min(10, {
      message: t("other.emergencyContactPhoneMessage"),
    }),
    insuranceProvider: z.string().optional(),
    insurancePolicyNumber: z.string().optional(),
    allergies: z.string().optional(),
    medicalHistory: z.string().optional(),
    currentMedications: z.string().optional(),
    consentToTreatment: z.boolean().refine((val) => val === true, {
      message: "You must agree to receive treatment.",
    }),
    privacyPolicy: z.boolean().refine((val) => val === true, {
      message: "You must agree to the privacy policy.",
    }),
  })


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      medicalHistory: "",
      currentMedications: "",
      consentToTreatment: false,
      privacyPolicy: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Patient registered successfully",
      description: `${values.firstName} ${values.lastName} has been registered.`,
    })
  }

  const nextStep = async () => {
    if (step === 1) {
      const result = await form.trigger(["firstName", "lastName", "dateOfBirth", "gender", "email", "phone"])
      if (result) setStep(2)
    } else if (step === 2) {
      const result = await form.trigger([
        "address",
        "city",
        "state",
        "zipCode",
        "emergencyContactName",
        "emergencyContactPhone",
      ])
      if (result) setStep(3)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/patients">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{t("other.PatientRegistration")}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("other.NewPatientInformation")}</CardTitle>
          <CardDescription>
            {t("other.RegisterPatient")} 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-8">
            <div className={`flex-1 border-b-2 pb-2 ${step >= 1 ? "border-primary" : "border-muted"}`}>
              {t("other.Step1")}
            </div>
            <div className={`flex-1 border-b-2 pb-2 ${step >= 2 ? "border-primary" : "border-muted"}`}>
              {t("other.Step2")}
            </div>
            <div className={`flex-1 border-b-2 pb-2 ${step >= 3 ? "border-primary" : "border-muted"}`}>
              {t("other.Step3")}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("other.DateBirth")} *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""
                                    }`}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>{t("other.PickDate")}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.Gender")} *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("other.SelectGender")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">{t("other.Male")} </SelectItem>
                              <SelectItem value="female">{t("other.Female")} </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.PhoneNumber")} *</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.Address")} *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.City")} *</FormLabel>
                          <FormControl>
                            <Input placeholder="Anytown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.State")} *</FormLabel>
                          <FormControl>
                            <Input placeholder="CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.ZipCode")} *</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.EmergencyContactName")} *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.EmergencyContactPhone")} *</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 987-6543" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="insuranceProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.insuranceProviderMessage")}</FormLabel>
                          <FormControl>
                            <Input placeholder="Insurance Company" {...field} />
                          </FormControl>
                          <FormDescription>{t("other.LeaveBlankIf")}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="insurancePolicyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("other.InsurancePolicyNumber")}</FormLabel>
                          <FormControl>
                            <Input placeholder="Policy #" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.Allergies")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any allergies (medications, food, etc.)"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.MedicalHistory")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Relevant medical history" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentMedications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("other.CurrentMedications")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List all current medications and dosages"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="consentToTreatment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{t("other.ITreatment")} *</FormLabel>
                            <FormDescription>
                              {t("other.ByChecking")}
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacyPolicy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{t("other.PrivacyPolicy")} *</FormLabel>
                            <FormDescription>
                              {t("other.ByCheck")}
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    {t("other.Previous")}
                  </Button>
                ) : (
                  <Link href="/patients">
                    <Button variant="outline">{t("other.Cancel")}</Button>
                  </Link>
                )}

                {step < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    {t("other.Next")}
                  </Button>
                ) : (
                  <Button type="submit">{t("other.RegisterPatient1")}</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
