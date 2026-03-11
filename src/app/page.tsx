import Image from "next/image"
import {
  Shield,
  ArrowRight,
  Building2,
  Users,
  Github,
  Coffee,
} from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { createAdminClient } from "@/lib/supabase/admin"
import { headers } from "next/headers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const isInAppBrowser = /FBAN|FBAV|Instagram|Line|Twitter|Snapchat/i.test(userAgent)

  // Fetch distinct companies with student count for the landing page showcase
  const supabase = createAdminClient()
  const { data: companyData } = await supabase
    .from("users")
    .select("company_name")
    .not("company_name", "is", null)
    .not("company_name", "eq", "")

  // Group by company and count students
  const companyMap = new Map<string, number>()
  companyData?.forEach(({ company_name }: { company_name: string | null }) => {
    if (company_name) {
      companyMap.set(company_name, (companyMap.get(company_name) ?? 0) + 1)
    }
  })

  // Sort by count (most students first), then alphabetically
  const companies = Array.from(companyMap.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  return (
    <div className="flex min-h-dvh flex-col bg-background overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* ─── Header Navigation ─── */}
      <nav className="bg-nav text-nav-foreground flex justify-between items-center px-6 py-5 md:px-12 relative z-20 shadow-md">
        <div className="flex items-center gap-4">
          <Image
            src="/sjpiicd-logo.png"
            alt="SJPIICD"
            width={32}
            height={32}
            className="rounded-md opacity-100 drop-shadow-md brightness-110 contrast-125 dark:grayscale dark:contrast-100 dark:brightness-100 dark:drop-shadow-none"
          />
          <span className="font-display text-xl tracking-widest text-nav-foreground font-bold">JP-Track</span>
        </div>
        <div className="flex items-center gap-2 [&_button]:text-nav-foreground [&_button]:hover:bg-nav-foreground/10 [&_button]:border-nav-foreground/20 [&_svg]:!text-nav-foreground">
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 relative overflow-hidden flex flex-col items-center border-b border-border/40">
        {/* Subtle ethereal grid background */}
        <div className="hero-grid hero-grid-fade absolute inset-0 z-0 opacity-[0.3] pointer-events-none" />

        {/* Hero Content (Centered Refinement) */}
        <div className="w-full max-w-5xl px-6 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
          <div className="animate-fade-up flex flex-col items-center">
            <span className="font-body text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-6 drop-shadow-sm">
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
              <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6">
                Authenticate via your academic Google Workspace credentials to proceed.
              </p>

              {isInAppBrowser && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400 font-medium">
                  <Shield className="mt-0.5 size-5 shrink-0" />
                  <span>
                    <strong>In-App Browser Detected:</strong> Google Sign-In is blocked here. Please tap the corner menu (•••) and select &quot;Open in system browser&quot; (Safari/Chrome) to log in.
                  </span>
                </div>
              )}

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



      {/* ─── Companies Showcase ─── */}
      {companies.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12 border-b border-border/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-body text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
                OJT Partner Companies
              </span>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
                Where Our Students Are
              </h2>
              <p className="mt-4 text-muted-foreground font-body font-light max-w-xl mx-auto">
                SJPIICD interns are gaining hands-on experience at leading Davao
                City organizations.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {companies.map(([name, count]) => (
                <div
                  key={name}
                  className="group flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm max-w-full"
                >
                  <Building2 className="flex-none size-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="flex-1 text-left leading-snug break-words whitespace-normal">{name}</span>
                  {count > 1 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-primary shrink-0 mt-0.5">
                      <Users className="size-3" />
                      {count}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground/60 mt-8 font-body">
              {companies.length} {companies.length === 1 ? 'company' : 'companies'} · {companyData?.length ?? 0} active {(companyData?.length ?? 0) === 1 ? 'intern' : 'interns'}
            </p>
          </div>
        </section>
      )}

      {/* ─── Support / Developer CTA ─── */}
      <section className="py-16 px-6 md:px-12 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 mb-6">
            <Coffee className="size-6 text-primary" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
            Support JP-Track
          </h2>
          <p className="text-muted-foreground font-body font-light mb-8 leading-relaxed">
            Built independently to make OJT tracking seamless for JPCEANS. If this tool saves you time and effort, show some love by grabbing me a coffee.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4" id="support">
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#007DFE]/10 text-[#0060C0] dark:text-[#52A8FF] hover:bg-[#007DFE]/20 px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5">
                  <Coffee className="size-4" />
                  <span>Fuel via GCash</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Support via GCash</DialogTitle>
                  <DialogDescription>
                    Scan this QR code using your GCash app to send your support!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                  <Image 
                    src="/qr-codes/gcash.jpg" 
                    alt="GCash QR Code" 
                    width={1224} 
                    height={1224} 
                    className="w-full h-auto max-w-[280px] rounded-xl shadow-sm border border-border/50"
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#00D1FF]/10 text-[#0070C0] dark:text-[#00D1FF] hover:bg-[#00D1FF]/20 px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5">
                  <Coffee className="size-4" />
                  <span>Support via GoTyme</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Support via GoTyme</DialogTitle>
                  <DialogDescription>
                    Scan this QR code using your GoTyme app to send your support!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                  <Image 
                    src="/qr-codes/gotyme.jpg" 
                    alt="GoTyme QR Code" 
                    width={1032} 
                    height={1403} 
                    className="w-full h-auto max-w-[280px] rounded-xl shadow-sm border border-border/50"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-nav text-nav-foreground px-6 py-12 md:px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div className="flex items-center justify-center md:justify-start">
          <span className="font-display tracking-widest text-xs uppercase opacity-90 break-words">
            © {new Date().getFullYear()} St. John Paul II College of Davao
          </span>
        </div>
        <div className="font-body font-light text-[11px] uppercase tracking-widest text-nav-foreground/70 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a href="https://kennethbulaga.dev" target="_blank" rel="noopener noreferrer" className="hover:text-nav-foreground hover:opacity-100 transition-colors">Developed by Kenneth Bulaga</a>
          <a href="https://github.com/kennethbulaga" target="_blank" rel="noopener noreferrer" className="hover:text-nav-foreground hover:opacity-100 transition-colors" aria-label="Source Code on GitHub">
            <Github className="size-4" />
          </a>
        </div>
      </footer>
    </div>
  )
}
