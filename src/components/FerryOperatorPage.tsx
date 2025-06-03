import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface FerryCharter {
  id: string;
  name: string;
  description: string;
  hero_image: string;
  fleet_description: string;
  services: string[];
  booking_url: string;
}

interface Schedule {
  id: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string;
  duration: string;
  status: string;
}

interface Price {
  id: string;
  fare_type: string;
  passenger_type: string;
  price_usd: number;
}

export default function FerryOperatorPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [operator, setOperator] = useState<FerryCharter | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch charter
      const { data: charter, error: charterErr } = await supabase
        .from("ferry_charters")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!charter || charterErr) {
        setOperator(null);
        setLoading(false);
        return;
      }

      setOperator(charter);

      // Fetch schedules
      const { data: scheduleData } = await supabase
        .from("ferry_charter_schedules")
        .select("*")
        .eq("charter_id", charter.id)
        .order("departure_time", { ascending: true });

      if (scheduleData) setSchedules(scheduleData);

      // Fetch prices
      const { data: priceData } = await supabase
        .from("ferry_charter_prices")
        .select("*")
        .eq("charter_id", charter.id)
        .order("fare_type", { ascending: true });

      if (priceData) setPrices(priceData);

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  if (!operator) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Operator Not Found</h1>
        <p>The requested ferry operator does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{operator.name} – Ferry Info</title>
        <meta name="description" content={`Details about ${operator.name}`} />
      </Head>
      <div className="p-6 md:p-12 text-white max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{operator.name}</h1>
        <p className="mb-6 text-gray-300">{operator.description}</p>

        {operator.hero_image && (
          <img
            src={operator.hero_image}
            alt={`${operator.name} Hero`}
            className="rounded-xl mb-8 w-full object-cover"
          />
        )}

        <h2 className="text-xl font-semibold mb-2">Fleet</h2>
        <p className="text-gray-400 mb-4">{operator.fleet_description}</p>

        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <ul className="list-disc list-inside text-gray-300 mb-6">
          {operator.services?.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>

        {/* Schedule Section */}
        {schedules.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Ferry Schedule</h2>
            <div className="grid gap-4 mb-6">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border rounded-xl p-4 bg-background/50"
                >
                  <p>
                    <strong>{schedule.departure_port}</strong> →{" "}
                    <strong>{schedule.arrival_port}</strong>
                  </p>
                  <p>
                    Departure: {schedule.departure_time} | Duration:{" "}
                    {schedule.duration}
                  </p>
                  <p>Status: {schedule.status}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pricing Section */}
        {prices.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Fares</h2>
            <div className="grid gap-4 mb-6">
              {Array.from(new Set(prices.map((p) => p.fare_type))).map(
                (fareType) => (
                  <div
                    key={fareType}
                    className="border rounded-xl p-4 bg-background/50"
                  >
                    <h3 className="font-semibold text-lg mb-2">{fareType}</h3>
                    {prices
                      .filter((p) => p.fare_type === fareType)
                      .map((p) => (
                        <p key={p.id}>
                          {p.passenger_type}: ${p.price_usd.toFixed(2)}
                        </p>
                      ))}
                  </div>
                )
              )}
            </div>
          </>
        )}

        {operator.booking_url && (
          <a
            href={operator.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition"
          >
            Book Now
          </a>
        )}
      </div>
    </>
  );
}
