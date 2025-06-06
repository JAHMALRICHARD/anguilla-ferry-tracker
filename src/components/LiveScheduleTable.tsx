/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import { getSecondsUntilArrival } from "../helpers/getSecondsUntilArrival";

import { supabase } from "@/utils/supabase";

import { convertTo24Hour } from "../helpers/convertTo24Hour";
import { FerryProgress } from "./Home/FerryProgress";
import { CustomDatePicker } from "./CustomDatePicker"; // adjust path if needed
import { FerryDetailsCard } from "./FerryDetailsCard";
import { addDays } from "date-fns";

export interface FerryItem {
  id: number;
  operator: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string;
  arrival_time?: string;
  price: string;
  duration: string;
  vessel_name?: string;
  status: string;
  direction: string;
  schedule_date: string;
  logo_url: string;
}

// good
interface LiveScheduleTableProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  route: { from: string; to: string };
  onRouteChange: (route: { from: string; to: string }) => void;
}

// good
function useCountdown(targetTime: string | null) {
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(0);
      return;
    }

    const departure = new Date();
    const [hours, minutes] = convertTo24Hour(targetTime).split(":").map(Number);
    departure.setHours(hours);
    departure.setMinutes(minutes);
    departure.setSeconds(0);

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.floor((departure.getTime() - now.getTime()) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}

function getCutOffTime(departureTime: string): string {
  const [hours, minutes] = convertTo24Hour(departureTime)
    .split(":")
    .map(Number);
  const cutoff = new Date();
  cutoff.setHours(hours);
  cutoff.setMinutes(minutes - 5); // 5 minutes before departure
  cutoff.setSeconds(0);

  return cutoff.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const getFerryDateTime = (ferry: FerryItem) =>
  new Date(`${ferry.schedule_date}T${convertTo24Hour(ferry.departure_time)}`);

export function LiveScheduleTable({
  selectedDate,
  onDateChange,
  route,
  onRouteChange,
}: LiveScheduleTableProps) {
  const [ferryData, setFerryData] = useState<FerryItem[]>([]);
  const [upcomingFerries, setUpcomingFerries] = useState<FerryItem[]>([]);
  const [pastFerries, setPastFerries] = useState<FerryItem[]>([]);
  const [sailingFerry, setSailingFerry] = useState<FerryItem | null>(null);
  const [selectedFerry, setSelectedFerry] = useState<FerryItem | null>(null);

  // ✅ Add this right here — only once
  const now = new Date();
  const localNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Puerto_Rico" })
  );

  //ferrydata

  useEffect(() => {
    const fetchFerryData = async () => {
      const { data, error } = await supabase
        .from("ferry_schedules")
        .select("*")
        .eq(
          "direction",
          route.to === "Anguilla" ? "to-anguilla" : "from-anguilla"
        )
        .eq("schedule_date", selectedDate.toISOString().split("T")[0])
        .order("departure_time", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      setFerryData(data || []);
    };

    fetchFerryData();
  }, [route.to, selectedDate]);

  // upcoming & past ferries
  useEffect(() => {
    const now = new Date();
    const localNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Puerto_Rico" })
    );

    const upcoming = ferryData
      .filter((ferry) => {
        const ferryDateTime = getFerryDateTime(ferry);
        return (
          ferry.direction ===
            (route.to === "Anguilla" ? "to-anguilla" : "from-anguilla") &&
          ferry.schedule_date === selectedDate.toISOString().split("T")[0] &&
          ferryDateTime >= localNow
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.schedule_date}T${convertTo24Hour(a.departure_time)}`
        );
        const dateB = new Date(
          `${b.schedule_date}T${convertTo24Hour(b.departure_time)}`
        );
        return dateA.getTime() - dateB.getTime();
      });

    const past = ferryData
      .filter((ferry) => {
        const ferryDateTime = getFerryDateTime(ferry);

        return (
          ferry.direction ===
            (route.to === "Anguilla" ? "to-anguilla" : "from-anguilla") &&
          ferry.schedule_date === selectedDate.toISOString().split("T")[0] &&
          ferryDateTime < localNow
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.schedule_date}T${convertTo24Hour(a.departure_time)}`
        );
        const dateB = new Date(
          `${b.schedule_date}T${convertTo24Hour(b.departure_time)}`
        );
        return dateB.getTime() - dateA.getTime();
      });

    setUpcomingFerries(upcoming);
    console.log("✅ Past Ferries Count", past.length);
    console.log(
      "🛳️ Past ferries:",
      past.map((f) => f.departure_time)
    );
    setPastFerries(past);
  }, [route.to, selectedDate, ferryData]);

  // sailing ferries
  useEffect(() => {
    const now = new Date().getTime();
    const sailing = pastFerries.find((ferry) => {
      const [hours, minutes] = convertTo24Hour(ferry.departure_time)
        .split(":")
        .map(Number);
      const departure = new Date();
      departure.setHours(hours, minutes, 0, 0);
      const arrivalTime =
        departure.getTime() + parseInt(ferry.duration) * 60000;
      return now >= departure.getTime() && now < arrivalTime;
    });

    setSailingFerry(sailing || null);
  }, [pastFerries]);

  const nextDeparture = upcomingFerries[0];

  const cutoffDate = new Date();
  if (nextDeparture) {
    const [hours, minutes] = convertTo24Hour(nextDeparture.departure_time)
      .split(":")
      .map(Number);
    cutoffDate.setHours(hours);
    cutoffDate.setMinutes(minutes - 5); // 5 minutes before departure
    cutoffDate.setSeconds(0);
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const noMoreFerriesToday =
    isToday && upcomingFerries.length === 0 && pastFerries.length > 0;

  let fallbackNextFerry: FerryItem | null = null;

  if (noMoreFerriesToday) {
    const tomorrow = addDays(selectedDate, 1);
    fallbackNextFerry =
      ferryData
        .filter((ferry) => {
          const ferryDate = new Date(ferry.schedule_date);
          return (
            ferry.direction ===
              (route.to === "Anguilla" ? "to-anguilla" : "from-anguilla") &&
            ferryDate.toDateString() === tomorrow.toDateString()
          );
        })
        .sort((a, b) => {
          const timeA = convertTo24Hour(a.departure_time);
          const timeB = convertTo24Hour(b.departure_time);
          return (
            new Date(`1970-01-01T${timeA}`).getTime() -
            new Date(`1970-01-01T${timeB}`).getTime()
          );
        })[0] || null;
  }

  const timeLeft = useCountdown(nextDeparture?.departure_time || null);

  let currentFerry: FerryItem | null = null;

  if (sailingFerry) {
    currentFerry = sailingFerry;
  } else if (pastFerries.length > 0) {
    const candidate = pastFerries[0];
    const [hours, minutes] = convertTo24Hour(candidate.departure_time)
      .split(":")
      .map(Number);
    const departure = new Date();
    departure.setHours(hours, minutes, 0, 0);
    const arrival = new Date(
      departure.getTime() + parseInt(candidate.duration) * 60000
    );

    if (new Date() < new Date(arrival.getTime() + 5 * 60000)) {
      currentFerry = candidate;
    }
  }

  if (!currentFerry) {
    currentFerry = nextDeparture ?? null;
  }

  let eta = "";
  if (currentFerry) {
    const [departureHour, departureMinute] = convertTo24Hour(
      currentFerry.departure_time
    )
      .split(":")
      .map(Number);
    const departureDate = new Date();
    departureDate.setHours(departureHour, departureMinute, 0, 0);
    eta = new Date(
      departureDate.getTime() + parseInt(currentFerry.duration) * 60000
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const sailingProgress = sailingFerry
    ? ((parseInt(sailingFerry.duration) * 60 -
        getSecondsUntilArrival(
          sailingFerry.departure_time,
          sailingFerry.duration,
          sailingFerry.schedule_date
        )) /
        (parseInt(sailingFerry.duration) * 60)) *
      100
    : 0;

  const departureProgress = nextDeparture
    ? Math.min(Math.max((3600 - timeLeft) / 36, 0), 100)
    : 0;

  const progress = sailingFerry ? sailingProgress : departureProgress;

  const getArrivalTime = (departureTime: string, duration: string) => {
    const [hours, minutes] = convertTo24Hour(departureTime)
      .split(":")
      .map(Number);
    const departure = new Date();
    departure.setHours(hours);
    departure.setMinutes(minutes);
    departure.setSeconds(0);

    const durationMinutes = parseInt(duration);
    departure.setMinutes(departure.getMinutes() + durationMinutes);

    return departure.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const filteredUpcoming = ferryData
      .filter((ferry) => {
        const ferryDateTime = new Date(
          `${ferry.schedule_date}T${ferry.departure_time}`
        );

        return (
          ferry.direction ===
            (route.to === "Anguilla" ? "to-anguilla" : "from-anguilla") &&
          ferry.schedule_date === selectedDate.toISOString().split("T")[0] &&
          ferryDateTime >= localNow
        );
      })
      .sort((a, b) => {
        const [monthA, dayA, yearA] = a.schedule_date.split("-");
        const [monthB, dayB, yearB] = b.schedule_date.split("-");
        const dateA = new Date(
          `20${yearA}-${monthA}-${dayA}T${convertTo24Hour(a.departure_time)}`
        );
        const dateB = new Date(
          `20${yearB}-${monthB}-${dayB}T${convertTo24Hour(b.departure_time)}`
        );
        return dateA.getTime() - dateB.getTime();
      });

    const filteredPast = ferryData
      .filter((ferry) => {
        const ferryDateTime = new Date(
          `${ferry.schedule_date}T${ferry.departure_time}`
        );

        return (
          ferry.direction ===
            (route.to === "Anguilla" ? "to-anguilla" : "from-anguilla") &&
          ferry.schedule_date === selectedDate.toISOString().split("T")[0] &&
          ferryDateTime < localNow
        );
      })
      .sort((a, b) => {
        const [monthA, dayA, yearA] = a.schedule_date.split("-");
        const [monthB, dayB, yearB] = b.schedule_date.split("-");
        const dateA = new Date(
          `20${yearA}-${monthA}-${dayA}T${convertTo24Hour(a.departure_time)}`
        );
        const dateB = new Date(
          `20${yearB}-${monthB}-${dayB}T${convertTo24Hour(b.departure_time)}`
        );
        return dateB.getTime() - dateA.getTime();
      });

    setUpcomingFerries(filteredUpcoming);
    setPastFerries(filteredPast);
  }, [route.to, selectedDate, ferryData]);

  useEffect(() => {
    const now = new Date().getTime();
    const live = pastFerries.find((ferry) => {
      const [hours, minutes] = convertTo24Hour(ferry.departure_time)
        .split(":")
        .map(Number);
      const departure = new Date();
      departure.setHours(hours);
      departure.setMinutes(minutes);
      departure.setSeconds(0);
      const durationMs = parseInt(ferry.duration) * 60 * 1000;
      const arrivalTime = departure.getTime() + durationMs;
      return now >= departure.getTime() && now < arrivalTime + 180000;
    });
    if (live) {
      console.log("🛳️ Sailing Ferry Found:", {
        id: live.id,
        operator: live.operator,
        departureTime: live.departure_time,
        duration: live.duration,
        date: live.schedule_date,
      });
    } else {
      console.log("🚫 No Sailing Ferry Found");
    }
    setSailingFerry(live || null);
  }, [pastFerries]);

  const showFerryProgress =
    !!sailingFerry || (!!nextDeparture && timeLeft <= 1800);

  let ferryStatus:
    | "DOCKED"
    | "BOARDING"
    | "SAILING"
    | "NOW ARRIVING"
    | "ARRIVED" = "DOCKED";

  if (sailingFerry) {
    const [hours, minutes] = convertTo24Hour(sailingFerry.departure_time)
      .split(":")
      .map(Number);
    const ferryDeparture = new Date(localNow);
    ferryDeparture.setHours(hours);
    ferryDeparture.setMinutes(minutes);
    ferryDeparture.setSeconds(0);

    const arrival = new Date(
      ferryDeparture.getTime() + parseInt(sailingFerry.duration) * 60000
    );
    const fiveMinutesAfterArrival = new Date(arrival.getTime() + 5 * 60000);

    if (
      localNow >= ferryDeparture &&
      localNow < new Date(ferryDeparture.getTime() + 5 * 60000)
    ) {
      ferryStatus = "BOARDING";
    } else if (
      localNow >= new Date(ferryDeparture.getTime() + 5 * 60000) &&
      localNow < arrival
    ) {
      ferryStatus = "SAILING";
    } else if (
      localNow >= new Date(arrival.getTime() - 5 * 60000) &&
      localNow < arrival
    ) {
      ferryStatus = "NOW ARRIVING";
    } else if (localNow >= arrival && localNow <= fiveMinutesAfterArrival) {
      ferryStatus = "ARRIVED";
    } else {
      ferryStatus = "DOCKED";
    }
  } else if (nextDeparture) {
    const [hours, minutes] = convertTo24Hour(nextDeparture.departure_time)
      .split(":")
      .map(Number);
    const nextDep = new Date(localNow);
    nextDep.setHours(hours);
    nextDep.setMinutes(minutes);
    nextDep.setSeconds(0);

    const timeDiff = localNow.getTime() - nextDep.getTime();
    const minutesDiff = timeDiff / 60000;

    if (timeDiff < 0) {
      ferryStatus = "DOCKED";
    } else if (minutesDiff >= 0 && minutesDiff <= 5) {
      ferryStatus = "BOARDING";
    }
  }

  if (sailingFerry) {
    // Ferry that recently departed and hasn't arrived yet
    currentFerry = sailingFerry;
  } else if (pastFerries.length > 0) {
    const candidate = pastFerries[0]; // most recent one
    const [hours, minutes] = convertTo24Hour(candidate.departure_time)
      .split(":")
      .map(Number);
    const departure = new Date(localNow);
    departure.setHours(hours);
    departure.setMinutes(minutes);
    departure.setSeconds(0);

    const durationMins = parseInt(candidate.duration);
    const arrival = new Date(departure.getTime() + durationMins * 60000);

    const stillInProgress =
      localNow >= departure &&
      localNow < new Date(arrival.getTime() + 5 * 60000);

    if (stillInProgress) {
      currentFerry = candidate;
    }
  }

  if (!currentFerry) {
    currentFerry = nextDeparture ?? null;
  }

  const ringColor = (() => {
    const secondsLeft = timeLeft; // Always based on next departure, not arrival

    if (secondsLeft <= 300) return "#22c55e"; // green
    if (secondsLeft <= 600) return "#f97316"; // orange
    if (secondsLeft <= 1200) return "#facc15"; // yellow
    return "#3B82F6"; // blue
  })();

  return (
    <div className="bg-[#151923] rounded-xl p-6 mb-16">
      <div className="flex flex-col space-y-6">
        {/* Route Selector Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() =>
              onRouteChange({ from: "St. Martin", to: "Anguilla" })
            }
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              route.to === "Anguilla"
                ? "bg-blue-500 text-white"
                : "bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]"
            }`}
          >
            <Image
              src="/flags/ai.png"
              alt="Anguilla Flag"
              width={20}
              height={20}
              className="rounded-sm"
            />
            To Anguilla
          </button>
          <button
            onClick={() =>
              onRouteChange({ from: "Anguilla", to: "St. Martin" })
            }
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              route.to === "St. Martin"
                ? "bg-blue-500 text-white"
                : "bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]"
            }`}
          >
            <Image
              src="/flags/sx.png"
              alt="St. Martin Flag"
              width={20}
              height={20}
              className="rounded-sm"
            />
            To St. Martin
          </button>
        </div>

        {/* Live Ferry Schedule + Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <h2 className="text-2xl font-bold text-white"> Ferry Schedule</h2>

            {showFerryProgress && (
              <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                <FerryProgress
                  operatorName={currentFerry?.operator || ""}
                  progressPercent={ferryStatus === "DOCKED" ? 0 : progress}
                  eta={eta}
                  status={ferryStatus}
                  direction={
                    route.to === "Anguilla" ? "to-anguilla" : "to-st-martin"
                  }
                />
              </div>
            )}
          </div>

          {(nextDeparture || (noMoreFerriesToday && fallbackNextFerry)) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
              {/* Countdown Timer Widget */}
              <div className="relative flex flex-col items-center justify-center text-center min-w-[140px]">
                <div
                  className="absolute inset-0 rounded-full blur-xl animate-ping"
                  style={{ backgroundColor: ringColor, opacity: 0.3 }}
                />
                <div className="z-10">
                  <span
                    className="text-xs tracking-widest uppercase font-bold"
                    style={{ color: ringColor }}
                  >
                    {noMoreFerriesToday ? "NEXT DAY" : "UNTIL BOARDING"}
                  </span>
                  <div className="text-3xl font-extrabold text-white leading-tight mt-1 whitespace-nowrap">
                    {noMoreFerriesToday
                      ? "--:--"
                      : `${String(Math.floor(timeLeft / 60)).padStart(
                          2,
                          "0"
                        )}:${String(timeLeft % 60).padStart(2, "0")}`}
                  </div>
                </div>
              </div>

              {/* Cut Off Time Widget */}
              <div className="relative flex flex-col items-center justify-center text-center min-w-[140px]">
                <div className="z-10">
                  <span className="text-xs text-red-400 tracking-widest uppercase font-bold">
                    Cut Off Time
                  </span>
                  <div className="text-3xl font-extrabold text-white leading-tight mt-1 whitespace-nowrap">
                    {noMoreFerriesToday
                      ? "CLOSED"
                      : getCutOffTime(nextDeparture?.departure_time || "00:00")}
                  </div>
                </div>
              </div>

              {/* Next Departure Info */}
              <div className="relative flex flex-col items-center justify-center text-center min-w-[140px]">
                <div className="z-10">
                  <span className="text-xs text-green-400 tracking-widest uppercase font-bold">
                    Next Departure
                  </span>
                  <div className="text-3xl font-extrabold text-white leading-tight mt-1 whitespace-nowrap">
                    {(noMoreFerriesToday ? fallbackNextFerry : nextDeparture)
                      ?.departure_time || "--:--"}
                  </div>
                </div>
              </div>

              {/* Operator Info */}
              <div className="flex flex-col items-center justify-center text-center min-w-[140px]">
                <span className="text-xs text-gray-400 tracking-widest uppercase font-bold -mt-2">
                  Operator
                </span>
                <span className="text-[1.2rem] font-bold text-blue-400 leading-tight mt-4 uppercase">
                  {(noMoreFerriesToday ? fallbackNextFerry : nextDeparture)
                    ?.operator || "--"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Date Tabs + Date Picker + Route Info */}
        <div className="flex flex-col gap-2">
          {/* Tabs Above Date Picker */}
          <div className="flex space-x-2 mb-1">
            <button
              onClick={() => onDateChange(new Date())}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedDate.toDateString() === new Date().toDateString()
                  ? "bg-blue-600 text-white"
                  : "bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onDateChange(addDays(new Date(), 1))}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedDate.toDateString() ===
                addDays(new Date(), 1).toDateString()
                  ? "bg-blue-600 text-white"
                  : "bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]"
              }`}
            >
              Tomorrow
            </button>
          </div>

          {/* Calendar Picker + Route */}
          <div className="flex flex-wrap items-center gap-4">
            <CustomDatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">{route.from}</span>
              <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{route.to}</span>
            </div>
          </div>
        </div>

        {/* Live Ferry Table */}
        <div className="bg-[#1E2A3B] border border-gray-700 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 17l4 4 4-4m0-5l-4-4-4 4"
              />
            </svg>
            Schdeule Ferries
          </h3>
          <div className="overflow-x-auto">
            {upcomingFerries.length > 0 ? (
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr className="text-gray-400">
                    <th className="text-left pb-4">DEPARTS</th>
                    <th className="text-left pb-4">PORT</th>
                    <th className="text-left pb-4">OPERATOR</th>
                    <th className="text-left pb-4">DURATION</th>
                    <th className="text-left pb-4">ARRIVES</th>
                    <th className="text-left pb-4">ARRIVAL PORT</th>
                    <th className="text-left pb-4">STATUS</th>
                    <th className="text-left pb-4">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {upcomingFerries.map((ferry) => (
                    <tr
                      key={ferry.id}
                      className="hover:bg-[#1E2A3B] transition-colors"
                    >
                      <td className="py-4">{ferry.departure_time}</td>
                      <td className="py-4">
                        {ferry.departure_port.split(",")[0]}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={ferry.logo_url}
                            alt={`${ferry.operator} logo`}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                          <p className="font-medium">{ferry.operator}</p>
                        </div>
                      </td>
                      <td className="py-4">{ferry.duration}</td>
                      <td className="py-4">
                        {getArrivalTime(ferry.departure_time, ferry.duration)}
                      </td>
                      <td className="py-4">
                        {ferry.arrival_port.split(",")[0]}
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-xs py-1 px-2 rounded-sm leading-none font-semibold uppercase ${
                            ferry.status === "on-time"
                              ? "bg-green-500/10 text-green-400"
                              : ferry.status === "delayed"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {ferry.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => setSelectedFerry(ferry)}
                          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-sm mt-4">
                No more ferries scheduled for this day.
              </p>
            )}
          </div>
        </div>
        {/* Previously Sailed Ferry Table */}
        {pastFerries.length > 0 && (
          <div className="bg-[#1E2A3B] border border-gray-700 rounded-xl p-6 mt-8 shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 17l4 4 4-4m0-5l-4-4-4 4"
                />
              </svg>
              Previously Sailed Ferries
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr className="text-gray-400">
                    <th className="text-left pb-4">DEPARTS</th>
                    <th className="text-left pb-4">PORT</th>
                    <th className="text-left pb-4">OPERATOR</th>
                    <th className="text-left pb-4">DURATION</th>
                    <th className="text-left pb-4">ARRIVES</th>
                    <th className="text-left pb-4">ARRIVAL PORT</th>
                    <th className="text-left pb-4">STATUS</th>
                    <th className="text-left pb-4">PROGRESS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pastFerries.map((ferry) => {
                    const [hours, minutes] = convertTo24Hour(
                      ferry.departure_time
                    )
                      .split(":")
                      .map(Number);
                    const departure = new Date(localNow);
                    departure.setHours(hours, minutes, 0, 0);
                    const durationMins = parseInt(ferry.duration);
                    const arrival = new Date(
                      departure.getTime() + durationMins * 60000
                    );
                    const fiveAfter = new Date(arrival.getTime() + 5 * 60000);

                    const isSailing =
                      localNow >= new Date(departure.getTime() + 5 * 60000) &&
                      localNow < arrival;
                    const isArrived =
                      localNow >= arrival && localNow < fiveAfter;

                    const status = isSailing
                      ? "SAILING"
                      : isArrived
                      ? "ARRIVED"
                      : "SAILED";

                    const progressPercent = isSailing
                      ? Math.min(
                          100,
                          ((localNow.getTime() - departure.getTime()) /
                            (arrival.getTime() - departure.getTime())) *
                            100
                        )
                      : 100;

                    return (
                      <tr
                        key={`past-${ferry.id}`}
                        className="hover:bg-[#1E2A3B] transition-colors"
                      >
                        <td className="py-4">{ferry.departure_time}</td>
                        <td className="py-4">
                          {ferry.departure_port.split(",")[0]}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={ferry.logo_url}
                              alt={`${ferry.operator} logo`}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                            <p className="font-medium">{ferry.operator}</p>
                          </div>
                        </td>
                        <td className="py-4">{ferry.duration}</td>
                        <td className="py-4">
                          {getArrivalTime(ferry.departure_time, ferry.duration)}
                        </td>
                        <td className="py-4">
                          {ferry.arrival_port.split(",")[0]}
                        </td>
                        <td className="py-4">
                          <span
                            className={`text-xs py-1 px-2 rounded-sm leading-none font-semibold uppercase ${
                              status === "SAILING"
                                ? "bg-blue-500/10 text-blue-400"
                                : status === "ARRIVED"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-gray-500/10 text-gray-400"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                status === "SAILING"
                                  ? "bg-blue-500"
                                  : status === "ARRIVED"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                              style={{
                                width: `${progressPercent.toFixed(0)}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedFerry && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            onClick={() => setSelectedFerry(null)} // Close on backdrop click
          >
            <div
              className="bg-[#1E2A3B] rounded-xl p-6 w-full max-w-3xl relative shadow-lg border border-gray-700"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
            >
              <button
                onClick={() => setSelectedFerry(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
              <FerryDetailsCard ferry={selectedFerry} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
