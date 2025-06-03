"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  InfoIcon,
  ArrowRightLeftIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  Check,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function formatTimeTo12Hour(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minuteStr} ${ampm}`;
}

interface FerryCharter {
  id: string;
  name: string;
  description: string;
  hero_image: string;
  fleet_description: string;
  services: string[];
  booking_url: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  featured_image?: string;
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

function FareCard({
  title,
  subtitle,
  price,
  season,
  features,
}: {
  title: string;
  subtitle: string;
  price: string;
  season: string;
  features: string[];
}) {
  return (
    <Card className="bg-background text-foreground shadow-xl rounded-2xl p-6 w-full max-w-sm">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {title} Fare
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs py-1 px-2 rounded-full border ${
              season === "SUMMER"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : "bg-blue-100 text-blue-800 border-blue-300"
            }`}
          >
            {season}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="text-4xl font-bold tracking-tight">{price}</div>
        <p className="text-sm text-muted-foreground">
          This fare includes complimentary SXM transfer, onboard refreshments,
          and full luggage support.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="default" size="lg" className="w-full">
          ✨ Reserve Now
        </Button>
        <div className="pt-4">
          <h4 className="text-sm uppercase text-muted-foreground mb-2">
            Included
          </h4>
          <ul className="space-y-2 text-sm">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> {feature}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            Prices may vary depending on seasonal demand and availability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FerryOperatorClient({ slug }: { slug: string }) {
  const [operator, setOperator] = useState<FerryCharter | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  const stockHero =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

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

      const { data: scheduleData } = await supabase
        .from("ferry_charter_schedules")
        .select("*")
        .eq("charter_id", charter.id)
        .order("departure_time", { ascending: true });

      if (scheduleData) setSchedules(scheduleData);

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
    return <div className="p-8 text-white text-center">Loading...</div>;
  }

  if (!operator) {
    return (
      <div className="p-8 text-white text-center">
        <h1 className="text-2xl font-bold mb-2">Operator Not Found</h1>
        <p>We couldn&apos;t find any ferry charter with this slug.</p>
      </div>
    );
  }

  const renderScheduleRow = (ferry: Schedule) => (
    <TableRow key={ferry.id}>
      <TableCell>{formatTimeTo12Hour(ferry.departure_time)}</TableCell>
      <TableCell className="flex items-center gap-3">
        {operator.featured_image && (
          <Image
            src={operator.featured_image}
            alt="Logo"
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        {operator.name}
      </TableCell>
      <TableCell>{ferry.departure_port}</TableCell>
      <TableCell>{ferry.arrival_port}</TableCell>
      <TableCell>{ferry.duration}</TableCell>
      <TableCell>{ferry.status}</TableCell>
    </TableRow>
  );

  const season = (() => {
    const month = new Date().getMonth() + 1;
    return month >= 3 && month <= 10 ? "SUMMER" : "WINTER";
  })();

  const sharedFeatures = [
    "Ground transfer from SXM Airport",
    "Refreshments onboard",
    "2 Checked Bags (50lbs each)",
    "1 Carry-on Included",
    "Local customer support",
  ];

  return (
    <div className="bg-background text-foreground">
      <Header />

      <div className="relative h-[600px] w-full overflow-hidden bg-black">
        <Image
          src={operator.hero_image || stockHero}
          alt={`${operator.name} Hero`}
          fill
          className="object-cover brightness-60"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-6xl font-semibold text-white tracking-tight drop-shadow-2xl">
            {operator.name}
          </h1>
          <p className="text-xl mt-6 text-gray-200 max-w-3xl leading-relaxed drop-shadow-lg">
            {operator.description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-20 space-y-24">
        <Card className="bg-muted/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-medium tracking-tight">
              Welcome Aboard
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Everything you need to know about {operator.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-lg text-muted-foreground leading-relaxed">
            {operator.description}
          </CardContent>
        </Card>

        <Card className="bg-muted/10 shadow-xl rounded-2xl">
          <CardHeader className="flex items-center gap-3">
            <InfoIcon className="text-green-600 w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">Services Offered</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Luxury experiences we provide
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-muted-foreground">
              {operator.services?.map((service, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRightLeftIcon className="mt-1" size={20} />
                  {service}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {schedules.length > 0 && (
          <>
            <Card className="bg-muted/10 shadow-xl rounded-2xl">
              <CardHeader className="flex items-center gap-3">
                <CalendarIcon className="text-blue-600 w-6 h-6" />
                <div>
                  <CardTitle className="text-2xl">
                    Ferry Schedule: To St. Maarten
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    Departures heading to St. Maarten
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="rounded-xl overflow-hidden shadow-md border mt-6">
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Departure</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules
                      .filter(
                        (f) =>
                          f.arrival_port.toLowerCase().includes("maarten") ||
                          f.arrival_port.toLowerCase().includes("martin")
                      )
                      .map(renderScheduleRow)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-muted/10 shadow-xl rounded-2xl">
              <CardHeader className="flex items-center gap-3">
                <CalendarIcon className="text-green-600 w-6 h-6" />
                <div>
                  <CardTitle className="text-2xl">
                    Ferry Schedule: To Anguilla
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    Departures heading to Anguilla
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="rounded-xl overflow-hidden shadow-md border mt-6">
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Departure</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules
                      .filter((f) =>
                        f.arrival_port.toLowerCase().includes("anguilla")
                      )
                      .map(renderScheduleRow)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {prices.length > 0 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Ticket Fares
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Explore seasonal pricing and fare options. Book early for best
                availability.
              </p>
            </div>

            <Tabs defaultValue="One-Way" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="One-Way">One Way</TabsTrigger>
                <TabsTrigger value="Round-Trip">Round Trip</TabsTrigger>
                <TabsTrigger value="Same-Day Return">
                  Same-Day Return
                </TabsTrigger>
              </TabsList>

              {["One-Way", "Round-Trip", "Same-Day Return"].map(
                (fareTypeKey) => (
                  <TabsContent key={fareTypeKey} value={fareTypeKey}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {prices
                        .filter((p) => p.fare_type === fareTypeKey)
                        .map((p) => {
                          return (
                            <FareCard
                              key={p.id}
                              title={p.passenger_type} // Adult, Child, Infant
                              subtitle={p.fare_type} // Same-Day Return, One-Way, etc.
                              price={`$${p.price_usd.toFixed(2)}`}
                              season={season}
                              features={sharedFeatures}
                            />
                          );
                        })}
                    </div>
                  </TabsContent>
                )
              )}
            </Tabs>
          </div>
        )}

        {operator.booking_url && (
          <div className="text-center mt-16">
            <a
              href={operator.booking_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="default"
                className="text-xl px-10 py-6 shadow-lg hover:shadow-2xl transition"
              >
                Reserve Your Journey
              </Button>
            </a>
          </div>
        )}

        {(operator.contact?.phone || operator.contact?.email) && (
          <Card className="bg-muted/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Contact & Info</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Get in touch with us
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-muted-foreground">
              {operator.contact?.phone && (
                <div className="flex items-center gap-3">
                  <PhoneIcon size={20} /> {operator.contact.phone}
                </div>
              )}
              {operator.contact?.email && (
                <div className="flex items-center gap-3">
                  <MailIcon size={20} /> {operator.contact.email}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
