"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RefreshCw, Settings, ChevronDown, LogOut } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import Image from "next/image";

interface ScheduleHeaderProps {
  full_name: string;
  email: string;
  role: string;
  onLogout: () => void;
}

export function ScheduleHeader({
  full_name,
  email,
  role,
  onLogout,
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Ferry Schedule Manager
        </h2>
        <p className="text-muted-foreground">
          Manage daily operations, edits, and live updates
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2">
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

        {/* Role badge moved beside Settings */}
        <Badge className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
          {role.toUpperCase()}
        </Badge>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 py-1"
            >
              <Image
                src="/profile/jrichard-head-photo-mqa.jpg"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{full_name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-500">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
