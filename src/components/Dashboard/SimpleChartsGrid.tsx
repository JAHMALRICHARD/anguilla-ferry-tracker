import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const emailVolumeData = [
  { month: "Jan", emails: 186, csvFiles: 45 },
  { month: "Feb", emails: 305, csvFiles: 67 },
  { month: "Mar", emails: 237, csvFiles: 89 },
  { month: "Apr", emails: 273, csvFiles: 123 },
  { month: "May", emails: 209, csvFiles: 156 },
  { month: "Jun", emails: 214, csvFiles: 178 },
];

const sensorData = [
  { metric: "Temperature", value: 24.5, unit: "°C", status: "normal" },
  { metric: "Humidity", value: 65, unit: "%", status: "normal" },
  { metric: "CPU Usage", value: 78, unit: "%", status: "warning" },
  { metric: "Memory", value: 45, unit: "%", status: "normal" },
];

const salesData = [
  { region: "North", sales: 4500, target: 4000, percentage: 112.5 },
  { region: "South", sales: 3200, target: 3500, percentage: 91.4 },
  { region: "East", sales: 5100, target: 4800, percentage: 106.3 },
  { region: "West", sales: 2800, target: 3200, percentage: 87.5 },
];

export function SimpleChartsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Email Volume Trends</CardTitle>
          <CardDescription>
            Monthly email processing and CSV file uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailVolumeData.map((data) => (
              <div
                key={data.month}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium w-8">{data.month}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Emails: {data.emails}</span>
                      <span>CSV: {data.csvFiles}</span>
                    </div>
                    <Progress
                      value={(data.emails / 350) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sensor Readings</CardTitle>
          <CardDescription>Real-time IoT sensor data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sensorData.map((sensor) => (
              <div
                key={sensor.metric}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{sensor.metric}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{sensor.value}</span>
                    <span className="text-sm text-muted-foreground">
                      {sensor.unit}
                    </span>
                    <Badge
                      variant={
                        sensor.status === "normal" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {sensor.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-3">
        <CardHeader>
          <CardTitle>Sales Performance by Region</CardTitle>
          <CardDescription>
            Current sales vs targets from field agent reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {salesData.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{region.region}</span>
                  <Badge
                    variant={region.percentage >= 100 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {region.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sales: ${region.sales.toLocaleString()}</span>
                    <span>Target: ${region.target.toLocaleString()}</span>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
