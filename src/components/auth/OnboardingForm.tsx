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

import { completeOnboarding, skipOnboarding } from "@/actions/onboarding"
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
      target_hours: 486,
    },
  })

  function onSubmit(data: OnboardingInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("target_hours", String(data.target_hours))

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

  function handleSkip() {
    startTransition(async () => {
      const result = await skipOnboarding()

      if (result && "error" in result) {
        toast.error(
          typeof result.error === "string"
            ? result.error
            : "Failed to skip onboarding."
        )
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
          Set your OJT target hours to get started. You can update this
          anytime in Settings.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      max={2000}
                      className="min-h-[44px] text-center text-lg font-semibold"
                      {...field}
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

        <Button
          variant="ghost"
          className="mt-3 w-full min-h-[44px] text-muted-foreground"
          disabled={isPending}
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      </CardContent>
    </Card>
  )
}
