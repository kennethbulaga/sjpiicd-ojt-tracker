import Image from "next/image"
import {
  Clock,
  BarChart3,
  FileText,
  Shield,
} from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const features = [
  {
    icon: Clock,
    title: "Quick Time Logging",
    description:
      "Log your OJT hours in seconds with smart defaults and session presets.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "See your completion percentage at a glance with a real-time progress ring.",
  },
  {
    icon: FileText,
    title: "DTR Export",
    description:
      "Export your Daily Time Record as CSV for submission to your coordinator.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Sign in with your SJPIICD Google account. Your data is yours alone.",
  },
]

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* ─── Hero Section ─── */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 md:py-28">
        {/* Dark mode toggle */}
        <div className="absolute right-4 top-4 z-20">
          <ThemeToggle />
        </div>

        {/* Subtle grid background */}
        <div className="hero-grid hero-grid-fade pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative z-10 mx-auto w-full max-w-md text-center">
          {/* Logo with entrance animation */}
          <div className="animate-scale-in">
            <Image
              src="/sjpiicd-logo.png"
              alt="SJPIICD Logo"
              width={88}
              height={88}
              priority
              className="mx-auto rounded-2xl shadow-lg ring-1 ring-border"
            />
          </div>

          {/* Title */}
          <div className="animate-fade-up delay-100 mt-6">
            <Badge variant="secondary" className="mb-4 text-xs font-medium tracking-wide">
              SJPIICD OJT Tracker
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Track Your OJT Hours
              <span className="mt-1 block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 mx-auto mt-4 max-w-xs text-base text-muted-foreground sm:text-lg">
            The fastest way for SJPIICD students to log, monitor, and export
            On-the-Job Training hours.
          </p>

          {/* Sign-in Card */}
          <div className="animate-fade-up delay-300 glow-card mt-10 w-full space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
            {params.error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-left text-sm text-destructive">
                <Shield className="mt-0.5 size-4 shrink-0" />
                <span>
                  {params.error === "auth_callback_error"
                    ? "Authentication failed. Please make sure you are using your @sjp2cd.edu.ph Google account."
                    : "An unexpected error occurred. Please try again."}
                </span>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Get started in seconds
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                No sign-up needed — just your school Google account.
              </p>
            </div>

            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">
                  School accounts only
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Only{" "}
              <span className="font-semibold text-foreground">
                @sjp2cd.edu.ph
              </span>{" "}
              accounts are authorized
            </p>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="border-t border-border px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="animate-fade-up text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Everything you need
            </h2>
            <p className="mt-2 text-muted-foreground">
              Simple tools to keep your OJT hours organized and on track.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={`animate-fade-up delay-${(i + 1) * 100} group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold leading-snug">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-muted/30 px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <Image
              src="/sjpiicd-logo.png"
              alt="SJPIICD"
              width={20}
              height={20}
              className="rounded"
            />
            <span>
              © {new Date().getFullYear()} JP Track — St. John Paul II College
              of Davao
            </span>
          </div>
          <p>
            Built by{" "}
            <a
              href="https://kennethbulaga.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Kenneth Bulaga
            </a>
            {" · "}
            <a
              href="https://github.com/kennethbulaga"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
