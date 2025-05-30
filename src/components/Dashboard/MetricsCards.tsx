"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Database, TrendingUp, Clock } from "lucide-react";

type ChangeType = "positive" | "negative" | "neutral";

interface Metric {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: React.ElementType;
  description: string;
}

const metrics: Metric[] = [
  {
    title: "Emails Processed",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: Mail,
    description: "from last month",
  },
  {
    title: "Data Points",
    value: "45,231",
    change: "+8%",
    changeType: "positive",
    icon: Database,
    description: "total records",
  },
  {
    title: "CSV Files",
    value: "89",
    change: "+23%",
    changeType: "positive",
    icon: TrendingUp,
    description: "processed this week",
  },
  {
    title: "Last Update",
    value: "2 min",
    change: "ago",
    changeType: "neutral",
    icon: Clock,
    description: "real-time sync",
  },
];

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  metric.changeType === "positive"
                    ? "text-green-600"
                    : metric.changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }
              >
                {metric.change}
              </span>{" "}
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
