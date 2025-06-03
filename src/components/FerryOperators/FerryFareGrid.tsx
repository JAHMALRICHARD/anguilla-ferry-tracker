import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type FerryPrice = {
  fare_type: string;
  passenger_type: string;
  price_usd: number;
  seasonal_notes?: string;
};

function FareCard({
  title,
  price,
  season,
  features,
}: {
  title: string;
  price: string;
  season: string;
  features: string[];
}) {
  return (
    <Card className="bg-background text-foreground shadow-xl rounded-2xl p-6 w-full max-w-sm">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <Badge
            variant="outline"
            className="text-xs py-1 px-2 rounded-full border border-muted"
          >
            {season}
          </Badge>
        </div>
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

export default function FerryFareGrid() {
  const [prices, setPrices] = useState<FerryPrice[]>([]);

  useEffect(() => {
    async function fetchPrices() {
      const { data, error } = await supabase
        .from("ferry_charter_prices")
        .select("fare_type, passenger_type, price_usd, seasonal_notes")
        .eq("charter_name", "Funtime Charters");

      if (error) {
        console.error("Error loading prices:", error);
      } else {
        setPrices(data);
      }
    }
    fetchPrices();
  }, []);

  const sharedFeatures = [
    "Ground transfer from SXM Airport",
    "Refreshments onboard",
    "2 Checked Bags (50lbs each)",
    "1 Carry-on Included",
    "Local customer support",
  ];

  const getSeason = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    return month >= 3 && month <= 10 ? "SUMMER" : "WINTER";
  };

  const cards = prices.map((price) => {
    const title =
      price.fare_type === "Same-Day Return"
        ? "Same-Day Return"
        : `${price.passenger_type} Fare`;

    return (
      <FareCard
        key={`${price.fare_type}-${price.passenger_type}`}
        title={title}
        price={`$${price.price_usd}`}
        season={getSeason()}
        features={sharedFeatures}
      />
    );
  });

  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{cards}</div>;
}
