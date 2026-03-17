import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./_components/onboarding-form";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export const metadata = {
  title: "Set Up Your Profile — JP Track",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Check if user already completed onboarding
  const { data: profile } = await supabase
    .from("users")
    .select("program")
    .eq("id", user.id)
    .single();

  if (profile?.program && profile.program !== "") {
    redirect("/dashboard");
  }

  const userName =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Student";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-8">
      {/* Theme Toggle */}
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <Image
        src="/sjpiicd-logo.png"
        alt="SJPIICD Logo"
        width={64}
        height={64}
        priority
        className="mb-6 rounded-xl shadow-md ring-1 ring-border"
      />

      <OnboardingForm userName={userName} />

      <p className="mt-6 text-center text-xs text-muted-foreground">
        You can update these details anytime in Settings.
      </p>
    </div>
  );
}
