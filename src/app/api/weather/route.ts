// app/api/weather/route.ts (App Router)
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "Blowing Point Anguilla";

  const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
    query
  )}&days=2&aqi=no&alerts=no`;

  try {
    console.log(apiUrl);
    const weatherRes = await fetch(apiUrl);

    if (!weatherRes.ok) {
      console.error(
        "🌩️ WeatherAPI responded with error:",
        await weatherRes.text()
      );
      return NextResponse.json({ error: "WeatherAPI failed" }, { status: 500 });
    }

    const data = await weatherRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Weather fetch crashed:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
