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
  if (!params?.slug) return notFound(); // ✅ Defensive check

  const supabase = createServerComponentClient<Database>({
    cookies: () => cookies(),
  });

  const { data: operator, error } = await supabase
    .from("ferry_charters")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!operator || error) return notFound();

  const { data: schedules } = await supabase
    .from("ferry_charter_schedules")
    .select("*")
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
