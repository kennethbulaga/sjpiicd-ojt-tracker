"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Separator } from "@/components/ui/separator"
import { CompanyCombobox } from "@/components/settings/CompanyCombobox"

import { completeOnboarding } from "@/actions/onboarding"
import {
  onboardingSchema,
  type OnboardingInput,
} from "@/lib/validations/onboarding"

interface OnboardingFormProps {
  userName: string
}

export function OnboardingForm({ userName }: OnboardingFormProps) {
  // nextjs-app-router-patterns: useTransition for Server Action calls
  const [isPending, startTransition] = useTransition()

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      company_name: "",
      target_hours: 486,
      program: "",
    },
  })

  function onSubmit(data: OnboardingInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("company_name", data.company_name)
      formData.set("target_hours", String(data.target_hours))
      if (data.program) {
        formData.set("program", data.program)
      }

      const result = await completeOnboarding(formData)

      if (result && "error" in result) {
        const errorMsg =
          typeof result.error === "string"
            ? result.error
            : "Please fix the errors above."
        toast.error(errorMsg)
      }
    })
  }



  const firstName = userName.split(" ")[0] || "Student"

  return (
    <Card className="w-full max-w-md rounded-xl shadow-sm">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">
          Welcome, {firstName}! 👋
        </CardTitle>
        <CardDescription>
          Tell us about your OJT placement to get started. You can update
          these anytime in Settings.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* 1. Company — required */}
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Organization</FormLabel>
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

            <Separator />

            {/* 2. Target Hours — required */}
            <FormField
              control={form.control}
              name="target_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target OJT Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={999}
                      className="min-h-[44px] text-center text-lg font-semibold"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    CHED-mandated hours for your program (default: 486 for
                    most programs).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* 3. Program — optional */}
            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Program / Course{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
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

            <Button
              type="submit"
              className="w-full min-h-[44px] text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Start Tracking"
              )}
            </Button>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}
