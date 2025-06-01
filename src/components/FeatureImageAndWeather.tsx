"use client";

import { CurrentWeatherWidget } from "./CurrentWeatherWidget";
import { FerryProgress } from "./FerryProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLiveScheduleData } from "@/hooks/useLiveScheduleData";
import { formatTime12Hour } from "@/helpers/formatTime12Hour";

interface FeatureImageAndWeatherProps {
  selectedDate: Date;
  route: { from: string; to: string };
}

export default function FeatureImageAndWeather({
  selectedDate,
  route,
}: FeatureImageAndWeatherProps) {
  const { upcomingFerries, localNow } = useLiveScheduleData(selectedDate);

  const direction =
    route.to === "To Anguilla - via Marigot" ? "to-anguilla" : "to-st-martin";

  const nextFerry = upcomingFerries.find((ferry) =>
    direction === "to-anguilla"
      ? ferry.direction === "to-anguilla"
      : ferry.direction === "from-anguilla"
  );

  const isToAnguilla = direction === "to-anguilla";

  const backgroundImage = isToAnguilla
    ? "/hero/resized-sxm-to-axa-hero-featured-image.jpg"
    : "/hero/resized-axa-to-sxm-hero-featured-image.jpg";

  const getProgressPercent = (departureTime: string): number => {
    const [h, m] = departureTime.split(":").map(Number);
    const depDate = new Date(selectedDate);
    depDate.setHours(h, m, 0);

    const diffInMinutes = (depDate.getTime() - localNow.getTime()) / 1000 / 60;
    const totalLead = 60;

    return Math.max(0, Math.min(100, 100 - (diffInMinutes / totalLead) * 100));
  };

  let ferrySailingStatus:
    | "DOCKED"
    | "BOARDING"
    | "SAILING"
    | "NOW ARRIVING"
    | "ARRIVED" = "DOCKED";

  if (nextFerry) {
    switch (nextFerry.status.toLowerCase()) {
      case "on-time":
      case "scheduled":
        ferrySailingStatus = "DOCKED";
        break;
      case "boarding":
      case "delayed":
        ferrySailingStatus = "BOARDING";
        break;
      case "sailing":
      case "departed":
        ferrySailingStatus = "SAILING";
        break;
      case "arriving":
        ferrySailingStatus = "NOW ARRIVING";
        break;
      case "arrived":
        ferrySailingStatus = "ARRIVED";
        break;
      default:
        ferrySailingStatus = "DOCKED";
    }
  }

  const getFormattedETA = (departure: string, duration: string): string => {
    const [depHour, depMin] = departure.split(":").map(Number);
    const [durHour, durMin] = duration.split(":").map(Number);

    const eta = new Date(selectedDate);
    eta.setHours(depHour + durHour);
    eta.setMinutes(depMin + durMin);

    return formatTime12Hour(
      `${eta.getHours().toString().padStart(2, "0")}:${eta
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  };

  // Grace Period Logic
  let showFerryProgress = false;
  if (nextFerry) {
    const [depHour, depMin] = nextFerry.departure_time.split(":").map(Number);
    const [durHour, durMin] = nextFerry.duration.split(":").map(Number);

    const departureDate = new Date(selectedDate);
    departureDate.setHours(depHour, depMin, 0);

    const etaDate = new Date(departureDate);
    etaDate.setHours(etaDate.getHours() + durHour);
    etaDate.setMinutes(etaDate.getMinutes() + durMin);

    const graceAfterArrival = new Date(etaDate);
    graceAfterArrival.setMinutes(graceAfterArrival.getMinutes() + 10);

    const showBeforeNext = new Date(departureDate);
    showBeforeNext.setHours(showBeforeNext.getHours() - 1);

    showFerryProgress =
      localNow >= showBeforeNext && localNow <= graceAfterArrival;
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Hero Section */}
        <div
          className="flex-1 relative rounded-2xl overflow-hidden text-white bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
          }}
        >
          <div
            className={`absolute inset-0 z-0 transition-colors duration-700 ${
              isToAnguilla
                ? "bg-gradient-to-b from-black/20 via-blue-900/40 to-blue-900/80"
                : "bg-gradient-to-b from-black/20 via-purple-900/40 to-purple-900/80"
            }`}
          />
          <div className="relative z-10 py-16 md:py-24 px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {isToAnguilla ? "Heading to Anguilla" : "Heading to St. Martin"}
            </h1>
            <p className="text-gray-200 text-xl mb-8 max-w-xl">
              Check ferry times, prices, travel docs & more
            </p>
            <Button
              variant="default"
              className="text-white text-base px-6 py-3"
            >
              See Schedule
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] space-y-4">
          <Card className="h-full">
            <CardContent className="p-4">
              <CurrentWeatherWidget />
            </CardContent>
          </Card>

          {/* Ferry Progress (with grace) */}
          {nextFerry && showFerryProgress && (
            <Card>
              <CardContent className="p-4 flex justify-center">
                <FerryProgress
                  operatorName={nextFerry.operator}
                  progressPercent={
                    ferrySailingStatus === "DOCKED"
                      ? 0
                      : getProgressPercent(nextFerry.departure_time)
                  }
                  eta={getFormattedETA(
                    nextFerry.departure_time,
                    nextFerry.duration
                  )}
                  status={ferrySailingStatus}
                  direction={direction}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
