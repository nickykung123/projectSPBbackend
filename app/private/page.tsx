import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: userRole, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (userError || !userRole) {
    redirect("/error");
  }
  if (userRole.role !== "admin") {
    console.log(userRole);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-3xl bg-slate-800 p-6 rounded-md">
          Sorry, you are not authorized to view this page
        </p>
      </div>
    )
  }

  return (
    <>
      <h1>Admin role only</h1>
    </>
  );
}
