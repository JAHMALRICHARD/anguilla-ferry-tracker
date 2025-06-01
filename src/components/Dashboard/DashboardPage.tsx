"use client";

import { MetricsCards } from "@/components/Dashboard/MetricsCards";
import { SimpleChartsGrid } from "@/components/Dashboard/SimpleChartsGrid";
import { RecentDataTable } from "@/components/Dashboard/RecentDataTable";
import { EmailLogsCard } from "@/components/Dashboard/EmailLogsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReusableDashboardHeader } from "../ResuableDashboardHeader";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.reload();
};

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<{
    full_name: string;
    email: string;
    role: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return;

      const { data: user } = await supabase
        .from("users")
        .select("full_name, email, role_id")
        .eq("id", userId)
        .maybeSingle();

      const { data: roleRow } = await supabase
        .from("roles")
        .select("name")
        .eq("id", user?.role_id)
        .maybeSingle();

      setUserInfo({
        full_name: user?.full_name ?? "Unknown",
        email: user?.email ?? "Unknown",
        role: roleRow?.name ?? "Unknown",
        id: userId,
      });
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="w-full bg-muted text-foreground">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {userInfo && (
          <ReusableDashboardHeader
            title="Ferry Tracker Dashboard"
            subtitle="Manage daily operations"
            full_name={userInfo.full_name}
            email={userInfo.email}
            role={userInfo.role}
            showProfile
            onLogout={handleLogout}
          />
        )}
        <MetricsCards />
        <SimpleChartsGrid />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Email Volume Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly email processing and CSV file uploads
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  ["Jan", 186, 45],
                  ["Feb", 305, 67],
                  ["Mar", 237, 89],
                  ["Apr", 273, 123],
                  ["May", 209, 156],
                  ["Jun", 214, 178],
                ].map(([month, emails, csv]) => (
                  <div key={month as string}>
                    {month}: Emails: {emails}, CSVs: {csv}
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mt-1">
                      <div
                        className="h-full bg-black dark:bg-white rounded"
                        style={{ width: `${(csv as number) / 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Sensor Readings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time IoT sensor data
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-lg">24.5°C</p>
                <span className="text-xs text-muted-foreground">
                  Temperature
                </span>
              </div>
              <div>
                <p className="font-medium text-lg">65%</p>
                <span className="text-xs text-muted-foreground">Humidity</span>
              </div>
              <div>
                <p className="font-medium text-lg text-yellow-600">78%</p>
                <span className="text-xs text-muted-foreground">
                  CPU Usage (warning)
                </span>
              </div>
              <div>
                <p className="font-medium text-lg">45%</p>
                <span className="text-xs text-muted-foreground">Memory</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentDataTable />
          <EmailLogsCard />
        </div>
      </div>
    </div>
  );
}
