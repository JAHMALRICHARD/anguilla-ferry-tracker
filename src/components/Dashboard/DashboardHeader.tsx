import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Settings } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          DataDrop Dashboard
        </h2>
        <p className="text-muted-foreground">
          Email-powered data collection and visualization
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Badge variant="outline" className="text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Live
        </Badge>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
