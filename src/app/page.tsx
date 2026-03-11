import Image from "next/image"
import {
  Clock,
  BarChart3,
  FileText,
  Shield,
  ArrowRight
} from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

const features = [
  {
    icon: Clock,
    title: "Elegant Timekeeping",
    description: "Record your hours with precision, bypassing the usual friction of manual entry.",
  },
  {
    icon: BarChart3,
    title: "Refined Metrics",
    description: "Watch your progress advance in an uncompromising, beautiful visual format.",
  },
  {
    icon: FileText,
    title: "Seamless Export",
    description: "Generate compliant, professional DTRs securely in a single unyielding click.",
  },
  {
    icon: Shield,
    title: "Exclusive Auth",
    description: "Secure, verified access via the @sjp2cd.edu.ph institutional network infrastructure.",
  },
]

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-dvh flex-col bg-background overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* ─── Header Navigation ─── */}
      <nav className="bg-primary dark:bg-background text-primary-foreground dark:text-foreground flex justify-between items-center px-6 py-5 md:px-12 border-b-0 dark:border-b dark:border-border/40 relative z-20 shadow-md dark:shadow-none">
        <div className="flex items-center gap-4">
          <Image
            src="/sjpiicd-logo.png"
            alt="SJPIICD"
            width={32}
            height={32}
            className="rounded-md opacity-100 drop-shadow-md brightness-110 contrast-125 dark:grayscale dark:contrast-100 dark:brightness-100 dark:drop-shadow-none"
          />
          <span className="font-display text-xl tracking-widest text-primary-foreground dark:text-foreground font-bold">JP-Track</span>
        </div>
        <div className="flex items-center gap-2 [&_button]:text-primary-foreground dark:[&_button]:text-foreground [&_button]:hover:bg-primary-foreground/10 dark:[&_button]:hover:bg-foreground/10 [&_button]:border-primary-foreground/20 dark:[&_button]:border-border/40 [&_svg]:!text-primary-foreground dark:[&_svg]:!text-foreground">
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 relative overflow-hidden flex flex-col items-center border-b border-border/40">
        {/* Subtle ethereal grid background */}
        <div className="hero-grid hero-grid-fade absolute inset-0 z-0 opacity-[0.3] pointer-events-none" />

        {/* Hero Content (Centered Refinement) */}
        <div className="w-full max-w-5xl px-6 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
          <div className="animate-fade-up flex flex-col items-center">
            <span className="font-body text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-sky-600 dark:text-sky-400 mb-6 drop-shadow-sm">
              Independent Student Initiative
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl break-words leading-[1.05] tracking-tight text-foreground max-w-4xl">
              Elevate your <br className="hidden sm:block" /> <i>OJT Tracking</i> Experience.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground font-body max-w-2xl leading-relaxed font-light">
              Professional-grade hour logging. Exclusively crafted and tailored for the students of St. John Paul II College of Davao.
            </p>
          </div>

          {/* Authentication Panel */}
          <div className="mt-16 w-full max-w-md relative z-10">
            <div className="animate-fade-up delay-200 ethereal-glow-card bg-card/80 backdrop-blur-md p-8 sm:p-10 w-full rounded-2xl">
              {params.error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive font-medium">
                  <Shield className="mt-0.5 size-5 shrink-0 opacity-80" />
                  <span>
                    {params.error === "auth_callback_error"
                      ? "Authentication denied. Exclusively restricted to @sjp2cd.edu.ph accounts."
                      : "System anomaly detected. Please attempt verification again."}
                  </span>
                </div>
              )}

              <h3 className="font-display text-2xl tracking-wide mb-1 text-foreground">Secure Access</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8">
                Authenticate via your academic Google Workspace credentials to proceed.
              </p>

              <div className="w-full">
                <GoogleSignInButton />
              </div>

              <div className="mt-8 pt-6 border-t border-border/30 flex justify-center">
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground opacity-70 flex items-center gap-2">
                  <ArrowRight className="size-3" /> Authorized Entities Only
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Features Banners ─── */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto w-full border-b border-border/30">
        {features.map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className={`p-10 lg:p-12 animate-fade-up delay-${(i + 1) * 100} group hover:bg-muted/30 transition-all duration-500 border-b md:border-b-0 md:border-r border-border/30 last:border-0`}
          >
            <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 text-primary dark:text-sky-400 group-hover:bg-primary dark:group-hover:bg-sky-400 group-hover:text-primary-foreground dark:group-hover:text-sky-950 transition-colors duration-300">
              <Icon />
            </div>
            <h3 className="font-display text-xl tracking-wide mb-3 text-foreground">{title}</h3>
            <p className="text-muted-foreground/80 leading-relaxed font-body font-light text-sm">
              {description}
            </p>
          </div>
        ))}
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-primary dark:bg-background text-primary-foreground dark:text-foreground px-6 py-12 md:px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 border-t-0 dark:border-t dark:border-border/40">
        <div className="flex items-center gap-3">
          <Image
            src="/sjpiicd-logo.png"
            alt="SJPIICD"
            width={24}
            height={24}
            className="opacity-90 grayscale contrast-125 dark:invert dark:opacity-70 dark:contrast-100"
          />
          <span className="font-display tracking-widest text-xs uppercase opacity-90 dark:opacity-70 break-words">
            © {new Date().getFullYear()} St. John Paul II College of Davao
          </span>
        </div>
        <div className="font-body font-light text-[11px] uppercase tracking-widest text-primary-foreground/70 dark:text-muted-foreground flex flex-wrap justify-center gap-4 sm:gap-6">
          <a href="https://kennethbulaga.dev" className="hover:text-accent dark:hover:text-foreground hover:opacity-100 transition-colors">Developed by Kenneth Bulaga</a>
          <a href="https://github.com/kennethbulaga" className="hover:text-accent dark:hover:text-foreground hover:opacity-100 transition-colors">Source Code</a>
        </div>
      </footer>
    </div>
  )
}
