// import { useRouter } from "next/router";
// import { ferryCharters } from "../data/FerryCharterData";
// import Head from "next/head";

// export default function FerryOperatorPage() {
//   const router = useRouter();
//   const { slug } = router.query;

//   if (!slug || typeof slug !== "string") return null;

//   const operator = ferryCharters[slug];

//   if (!operator) {
//     return (
//       <div className="p-8 text-white">
//         <h1 className="text-2xl font-bold mb-4">Operator Not Found</h1>
//         <p>The requested ferry operator does not exist.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Head>
//         <title>{operator.name} – Ferry Info</title>
//         <meta name="description" content={`Details about ${operator.name}`} />
//       </Head>
//       <div className="p-6 md:p-12 text-white max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-4">{operator.name}</h1>
//         <p className="mb-6 text-gray-300">{operator.description}</p>

//         <img
//           src={operator.heroImage}
//           alt={`${operator.name} Hero`}
//           className="rounded-xl mb-8 w-full object-cover"
//         />

//         <section className="mb-8">
//           <h2 className="text-xl font-semibold mb-2">Fleet</h2>
//           <p className="text-gray-400">{operator.fleetDescription}</p>
//         </section>

//         <section className="mb-8">
//           <h2 className="text-xl font-semibold mb-2">Services</h2>
//           <ul className="list-disc list-inside text-gray-300">
//             {operator.services.map((service, i) => (
//               <li key={i}>{service}</li>
//             ))}
//           </ul>
//         </section>

//         <section className="mb-8">
//           <h2 className="text-xl font-semibold mb-2">Schedule</h2>
//           <ul className="list-disc list-inside text-gray-300">
//             {operator.schedule.map((entry, i) => (
//               <li key={i}>
//                 <strong>{entry.from}</strong>: {entry.to}
//               </li>
//             ))}
//           </ul>
//         </section>

//         <section className="mb-8">
//           <h2 className="text-xl font-semibold mb-2">Departure Taxes</h2>
//           <ul className="list-disc list-inside text-gray-300">
//             {operator.departureTaxes.map((tax, i) => (
//               <li key={i}>{tax}</li>
//             ))}
//           </ul>
//         </section>

//         <section className="mb-8">
//           <h2 className="text-xl font-semibold mb-2">Travel Tips</h2>
//           <ul className="list-disc list-inside text-gray-300">
//             {operator.travelTips.map((tip, i) => (
//               <li key={i}>{tip}</li>
//             ))}
//           </ul>
//         </section>

//         <section className="mb-8">
//           <h2 className="text-xl font-semibold mb-2">Testimonials</h2>
//           <ul className="space-y-2 text-gray-300">
//             {operator.testimonials.map((testimonial, i) => (
//               <li key={i}>
//                 <blockquote>“{testimonial.message}”</blockquote>
//                 <cite className="text-sm block mt-1 text-gray-500">
//                   – {testimonial.author}
//                 </cite>
//               </li>
//             ))}
//           </ul>
//         </section>

//         <a
//           href={operator.bookingUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition"
//         >
//           Book Now
//         </a>
//       </div>
//     </>
//   );
// }

import { useRouter } from "next/router";
import { ferryCharters } from "../data/FerryCharterData";
import Head from "next/head";

export default function FerryOperatorPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug || typeof slug !== "string") return null;

  const operator = ferryCharters[slug];

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

        <img
          src={operator.heroImage}
          alt={`${operator.name} Hero`}
          className="rounded-xl mb-8 w-full object-cover"
        />

        <h2 className="text-xl font-semibold mb-2">Fleet</h2>
        <p className="text-gray-400 mb-4">{operator.fleetDescription}</p>

        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <ul className="list-disc list-inside text-gray-300 mb-4">
          {operator.services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>

        <a
          href={operator.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition"
        >
          Book Now
        </a>
      </div>
    </>
  );
}
