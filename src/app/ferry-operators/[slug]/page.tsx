// src/app/ferry-operators/[slug]/page.tsx

import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import FerryOperatorPage from "@/components/FerryOperators/FerryOperatorPage";

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const slug = params?.slug?.trim();
  if (!slug) return notFound();

  // ✅ Safe use of cookies() before passing into Supabase
  const cookieStore = cookies();

  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  // ✅ Use destructured `slug` only after confirming it's valid
  const { data: operator, error } = await supabase
    .from("ferry_charters")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!operator || error) return notFound();

  const { data: schedules } = await supabase
    .from("ferry_charter_schedules")
    .select(
      "id, departure_port, arrival_port, departure_time, duration, status, season"
    )
    .eq("charter_id", operator.id)
    .order("departure_time", { ascending: true });

  const { data: prices } = await supabase
    .from("ferry_charter_prices")
    .select("*")
    .eq("charter_id", operator.id)
    .order("fare_type", { ascending: true });

  return (
    <FerryOperatorPage
      operator={operator}
      schedules={schedules || []}
      prices={prices || []}
    />
  );
}
