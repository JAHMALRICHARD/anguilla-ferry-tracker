"use client";

import { FerryCharterInfo } from "@/data/FerryCharterData";
import {
  ShipIcon,
  InfoIcon,
  ArrowRightLeftIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function FerryOperatorClient({
  operator,
}: {
  operator: FerryCharterInfo;
}) {
  const stockHero =
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="bg-background text-foreground">
      <Header />

      {/* Hero */}
      <div className="relative h-[600px] w-full overflow-hidden bg-black">
        <Image
          src={operator.heroImage || stockHero}
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
        {/* Overview */}
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

        {/* Fleet */}
        <Card className="bg-muted/10 shadow-xl rounded-2xl">
          <CardHeader className="flex items-center gap-3">
            <ShipIcon className="text-blue-600 w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">Our Fleet</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Explore our luxury vessels
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-6">
            <p className="text-lg">{operator.fleetDescription}</p>
            {Array.isArray(operator.fleet) && operator.fleet.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {operator.fleet.map((vessel, i) => (
                  <li
                    key={i}
                    className="bg-background border border-muted rounded-2xl shadow-md hover:shadow-lg transition p-5 space-y-3"
                  >
                    <Image
                      src={vessel.image || stockHero}
                      alt={vessel.name}
                      width={500}
                      height={300}
                      className="rounded-xl object-cover w-full h-56"
                    />
                    <h3 className="text-xl font-semibold text-foreground">
                      {vessel.name}
                    </h3>
                    <p className="text-md text-muted-foreground">
                      {vessel.description}
                    </p>
                    <Button
                      className="mt-3 text-md px-5 py-2"
                      variant="outline"
                    >
                      Book This Vessel
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Services */}
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
              {operator.services.map((service, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRightLeftIcon className="mt-1" size={20} />
                  {service}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="bg-muted/10 shadow-xl rounded-2xl">
          <CardHeader className="flex items-center gap-3">
            <CalendarIcon className="text-yellow-600 w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">Daily Schedule</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Routes & Times
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table className="rounded-xl overflow-hidden shadow-md border mt-6">
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="text-lg px-6 py-4">From</TableHead>
                  <TableHead className="text-lg px-6 py-4">To</TableHead>
                  <TableHead className="text-lg px-6 py-4">Departure</TableHead>
                  <TableHead className="text-lg px-6 py-4">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operator.schedule.map((entry, i) => (
                  <TableRow key={i} className="hover:bg-muted/30 transition">
                    <TableCell className="px-6 py-4">{entry.from}</TableCell>
                    <TableCell className="px-6 py-4">{entry.to}</TableCell>
                    <TableCell className="px-6 py-4">
                      {entry.time || "TBD"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {entry.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Booking CTA */}
        <div className="text-center mt-16">
          <a
            href={operator.bookingUrl}
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

        {/* Contact */}
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

        {/* Featured Vessel */}
        {operator.featuredImage && (
          <Card className="bg-muted/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Featured Vessel</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={operator.featuredImage}
                alt="Featured Vessel"
                width={800}
                height={500}
                className="rounded-2xl object-cover w-full h-auto"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
