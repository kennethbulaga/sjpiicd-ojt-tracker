import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./_components/settings-form";

export const metadata = {
  title: "Settings — JP Track",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch the user's current profile from the database
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, nickname, program, company_name, target_hours")
    .eq("id", user.id)
    .single();

  // Build default values from DB profile, falling back to auth metadata
  const defaultValues = {
    full_name:
      profile?.full_name ??
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      "",
    nickname: profile?.nickname ?? "",
    program: profile?.program ?? "",
    company_name: profile?.company_name ?? null,
    target_hours: profile?.target_hours ?? 486,
    email: user.email ?? "",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and OJT preferences.
        </p>
      </div>

      <SettingsForm defaultValues={defaultValues} />
    </div>
  );
}
