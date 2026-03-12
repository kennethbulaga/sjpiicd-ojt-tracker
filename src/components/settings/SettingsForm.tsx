"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, Building2, User, Target } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { updateProfile } from "@/actions/profile"
import { CompanyCombobox } from "@/components/settings/CompanyCombobox"
import { profileSchema, type ProfileInput } from "@/lib/validations/profile"

interface SettingsFormProps {
  defaultValues: {
    full_name: string
    nickname?: string | null
    program: string
    company_name: string | null
    target_hours: number
    email: string
  }
}

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: defaultValues.full_name,
      nickname: defaultValues.nickname ?? "",
      program: defaultValues.program,
      company_name: defaultValues.company_name ?? "",
      target_hours: defaultValues.target_hours,
    },
  })

  function onSubmit(data: ProfileInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("full_name", data.full_name)
      formData.set("nickname", data.nickname ?? "")
      formData.set("program", data.program)
      formData.set("company_name", data.company_name ?? "")
      formData.set("target_hours", String(data.target_hours))

      const result = await updateProfile(formData)

      if (result && "error" in result) {
        if (typeof result.error === "string") {
          toast.error("Failed to update profile", { description: result.error })
        } else {
          const errors = result.error as Record<string, string[] | undefined>
          Object.entries(errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as keyof ProfileInput, {
                type: "server",
                message: messages[0],
              })
            }
          })
          toast.error("Please fix the errors in the form.")
        }
        return
      }

      toast.success("Profile updated!", {
        description: "Your settings have been saved.",
      })
    })
  }

  return (
    <div className="space-y-6">
      {/* Account Info (read-only) */}
      <Card className="rounded-xl shadow-sm py-3 px-0 sm:py-5">
        <CardHeader className="space-y-1.5 pb-3 sm:pb-4 px-3 sm:px-5">
          <CardTitle className="text-[15px] sm:text-lg">Account</CardTitle>
          <CardDescription className="text-[11px] sm:text-sm">
            Your Google Workspace account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-5">
          <div className="space-y-1">
            <p className="text-[12px] sm:text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-[13px] sm:text-sm font-semibold">{defaultValues.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Editable Profile */}
      <Card className="rounded-xl shadow-sm py-3 px-0 sm:py-5">
        <CardHeader className="space-y-1.5 pb-3 sm:pb-4 px-3 sm:px-5">
          <CardTitle className="text-[15px] sm:text-lg">Profile</CardTitle>
          <CardDescription className="text-[11px] sm:text-sm">
            Update your personal information and OJT configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              {/* Personal Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <User className="size-3.5 sm:size-4" />
                  Personal Information
                </h3>

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan Dela Cruz"
                          className="min-h-[44px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nickname (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What should we call you?"
                          className="min-h-[44px]"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Used for your dashboard greeting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program / Course</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., BSIT, BSBA, BEED"
                          className="min-h-[44px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your enrolled academic program.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* OJT Configuration */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Building2 className="size-3.5 sm:size-4" />
                  OJT Details
                </h3>

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company / Organization
                      </FormLabel>
                      <FormControl>
                        <CompanyCombobox
                          value={field.value ?? ""}
                          onChange={(val) => field.onChange(val)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormDescription>
                        Where you&apos;re completing your OJT.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Target Hours */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Target className="size-3.5 sm:size-4" />
                  Target Hours
                </h3>

                <FormField
                  control={form.control}
                  name="target_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required OJT Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="486"
                          className="min-h-[44px] max-w-[200px]"
                          min={1}
                          max={999}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        Total hours required by your program.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="min-h-[44px] w-full sm:w-auto"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
