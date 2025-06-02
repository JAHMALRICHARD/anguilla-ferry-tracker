import { notFound } from "next/navigation";
import { ferryCharters } from "@/data/FerryCharterData";
import FerryOperatorClient from "@/components/FerryOperators/FerryOperatorClient";

export async function generateStaticParams() {
  return Object.keys(ferryCharters).map((slug) => ({ slug }));
}

export default function FerryOperatorPage({
  params,
}: {
  params: { slug: string };
}) {
  const operator = ferryCharters[params.slug];
  if (!operator) return notFound();

  return <FerryOperatorClient operator={operator} />;
}
