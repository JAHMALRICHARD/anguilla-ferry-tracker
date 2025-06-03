import { notFound } from "next/navigation";
import FerryOperatorClient from "@/components/FerryOperators/FerryOperatorClient";

interface PageProps {
  params: { slug: string };
}

export default function FerryOperatorPage({ params }: PageProps) {
  if (!params.slug) return notFound();

  return <FerryOperatorClient slug={params.slug} />;
}
