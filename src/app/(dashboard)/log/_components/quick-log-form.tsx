"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { createTimeEntry } from "@/actions/time-entries"
import {
	timeEntrySchema,
	sessionTypes,
	type TimeEntryInput,
} from "@/lib/validations/time-entry"
import { SMART_DEFAULTS } from "@/lib/constants"

import { DailyEntries } from "./daily-entries"
import type { TimeEntryListItem } from "./shared"

interface QuickLogFormProps {
	initialDate: string
	userId: string | null
	initialEntries: TimeEntryListItem[]
}

export function QuickLogForm({
	initialDate,
	userId,
	initialEntries,
}: QuickLogFormProps) {
	const [isPending, startTransition] = useTransition()
	const [refreshKey, setRefreshKey] = useState(0)
	const router = useRouter()
	const pathname = usePathname()

	function updateDateParam(date: string) {
		const params = new URLSearchParams(window.location.search)
		params.set("date", date)
		router.replace(`${pathname}?${params.toString()}`, { scroll: false })
	}

	const form = useForm<TimeEntryInput>({
		resolver: zodResolver(timeEntrySchema),
		defaultValues: {
			date_logged: initialDate,
			time_in: SMART_DEFAULTS.MORNING.time_in + ":00",
			time_out: SMART_DEFAULTS.MORNING.time_out + ":00",
			session_type: "Morning",
			task_description: "",
		},
	})

	const selectedDate = useWatch({
		control: form.control,
		name: "date_logged",
	})

	function handleSessionTypeChange(value: string) {
		form.setValue("session_type", value as TimeEntryInput["session_type"])

		if (value === "Morning") {
			form.setValue("time_in", SMART_DEFAULTS.MORNING.time_in + ":00")
			form.setValue("time_out", SMART_DEFAULTS.MORNING.time_out + ":00")
		} else if (value === "Afternoon") {
			form.setValue("time_in", SMART_DEFAULTS.AFTERNOON.time_in + ":00")
			form.setValue("time_out", SMART_DEFAULTS.AFTERNOON.time_out + ":00")
		}
	}

	function onSubmit(data: TimeEntryInput) {
		startTransition(async () => {
			const formData = new FormData()
			formData.set("date_logged", data.date_logged)
			formData.set("time_in", data.time_in)
			formData.set("time_out", data.time_out)
			formData.set("session_type", data.session_type)
			if (data.task_description) {
				formData.set("task_description", data.task_description)
			}

			const result = await createTimeEntry(formData)

			if (result && "error" in result) {
				if (typeof result.error === "string") {
					toast.error("Failed to log entry", { description: result.error })
				} else {
					const errors = result.error as Record<string, string[] | undefined>
					Object.entries(errors).forEach(([field, messages]) => {
						if (messages?.[0]) {
							form.setError(field as keyof TimeEntryInput, {
								type: "server",
								message: messages[0],
							})
						}
					})
					toast.error("Please fix the errors in the form.")
				}
				return
			}

			toast.success("Hours logged!", {
				description: `${data.session_type} session on ${format(new Date(data.date_logged + "T00:00:00"), "MMM d, yyyy")}`,
			})

			setRefreshKey((key) => key + 1)

			form.reset({
				date_logged: data.date_logged,
				time_in: data.time_in,
				time_out: data.time_out,
				session_type: data.session_type,
				task_description: "",
			})
		})
	}

	return (
		<Card className="rounded-xl px-0 py-3 shadow-sm sm:py-5">
			<CardHeader className="space-y-0 px-3 pb-3 sm:px-5 sm:pb-4">
				<CardTitle className="flex items-center gap-1.5 text-[15px] sm:gap-2 sm:text-lg">
					<Clock className="size-4 text-primary sm:size-5" />
					Quick Log
				</CardTitle>
			</CardHeader>

			<CardContent className="px-3 sm:px-5">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
						<FormField
							control={form.control}
							name="date_logged"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														"w-full min-h-[44px] justify-start text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 size-4" />
													{field.value
														? format(new Date(field.value + "T00:00:00"), "EEEE, MMMM d, yyyy")
														: "Pick a date"}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value ? new Date(field.value + "T00:00:00") : undefined}
												onSelect={(date) => {
													if (date) {
														const dateStr = format(date, "yyyy-MM-dd")
														field.onChange(dateStr)
														updateDateParam(dateStr)
													}
												}}
												disabled={(date) => date > new Date()}
											/>
										</PopoverContent>
									</Popover>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="session_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Session Type</FormLabel>
									<Select onValueChange={handleSessionTypeChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="min-h-[44px]">
												<SelectValue placeholder="Select session" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sessionTypes.map((type) => (
												<SelectItem key={type} value={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Selecting Morning or Afternoon auto-fills the times.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="time_in"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Time In</FormLabel>
										<FormControl>
											<Input
												type="time"
												step="60"
												className="min-h-[44px]"
												value={field.value.slice(0, 5)}
												onChange={(event) => field.onChange(event.target.value + ":00")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="time_out"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Time Out</FormLabel>
										<FormControl>
											<Input
												type="time"
												step="60"
												className="min-h-[44px]"
												value={field.value.slice(0, 5)}
												onChange={(event) => field.onChange(event.target.value + ":00")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="task_description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										What did you work on? <span className="font-normal text-muted-foreground">(optional)</span>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="e.g., Encoded student records, organized files..."
											className="min-h-[80px] resize-none"
											maxLength={500}
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-right">
										{field.value?.length ?? 0}/500
									</FormDescription>
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="min-h-[44px] w-full text-base font-semibold"
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Logging...
								</>
							) : (
								"Log Hours"
							)}
						</Button>
					</form>
				</Form>

				<DailyEntries
					dateLogged={selectedDate ?? initialDate}
					userId={userId}
					initialEntries={initialEntries}
					refreshToken={refreshKey}
				/>
			</CardContent>
		</Card>
	)
}
