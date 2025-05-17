import { notFound } from "next/navigation";
import { ferryCharters } from "@/data/FerryCharterData";
import {
  ShipIcon,
  InfoIcon,
  BadgeDollarSignIcon,
  CalendarIcon,
  PlaneTakeoffIcon,
  MessageCircleIcon,
  MapIcon,
  ArrowRightLeftIcon,
} from "lucide-react";

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

  const stockHero =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <img
          src={operator.heroImage || stockHero}
          alt={`${operator.name} Hero`}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-md">
            {operator.name}
          </h1>
          <p className="text-lg mt-2 text-gray-200 max-w-2xl">
            {operator.description}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-12">
        {/* Fleet */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <ShipIcon className="text-blue-400" />
            <h2 className="text-2xl font-semibold">Our Fleet</h2>
          </div>
          <p className="text-gray-300">{operator.fleetDescription}</p>
          <hr className="my-6 border-gray-700" />
        </section>

        {/* Services */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <InfoIcon className="text-green-400" />
            <h2 className="text-2xl font-semibold">Services Offered</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
            {operator.services.map((service, i) => (
              <li key={i} className="flex items-start gap-2">
                <ArrowRightLeftIcon className="mt-1" size={18} />
                {service}
              </li>
            ))}
          </ul>
          <hr className="my-6 border-gray-700" />
        </section>

        {/* Schedule */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="text-yellow-400" />
            <h2 className="text-2xl font-semibold">Daily Schedule</h2>
          </div>
          <ul className="space-y-2 text-gray-300">
            {operator.schedule.map((entry, i) => (
              <li key={i} className="flex items-center gap-3">
                <PlaneTakeoffIcon size={20} />
                <span className="font-medium">{entry.from}</span> →{" "}
                <span className="text-gray-400">{entry.to}</span>
              </li>
            ))}
          </ul>
          <hr className="my-6 border-gray-700" />
        </section>

        {/* Taxes */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <BadgeDollarSignIcon className="text-pink-400" />
            <h2 className="text-2xl font-semibold">Departure Taxes</h2>
          </div>
          <ul className="list-disc list-inside text-gray-300">
            {operator.departureTaxes.map((tax, i) => (
              <li key={i}>{tax}</li>
            ))}
          </ul>
          <hr className="my-6 border-gray-700" />
        </section>

        {/* Travel Tips */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <MapIcon className="text-purple-400" />
            <h2 className="text-2xl font-semibold">Travel Tips</h2>
          </div>
          <ul className="list-disc list-inside text-gray-300">
            {operator.travelTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
          <hr className="my-6 border-gray-700" />
        </section>

        {/* Testimonials */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircleIcon className="text-teal-400" />
            <h2 className="text-2xl font-semibold">Testimonials</h2>
          </div>
          <div className="space-y-4">
            {operator.testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-[#1e293b] p-4 rounded-lg shadow border border-gray-700"
              >
                <blockquote className="text-gray-200 italic">
                  “{testimonial.message}”
                </blockquote>
                <cite className="block text-sm mt-2 text-gray-400">
                  – {testimonial.author}
                </cite>
              </div>
            ))}
          </div>
        </section>

        {/* Booking CTA */}
        <div className="text-center mt-10">
          <a
            href={operator.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
