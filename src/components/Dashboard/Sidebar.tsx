import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Database,
  Mail,
  Settings,
  Users,
  FileText,
  Activity,
  Zap,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Data Sources",
    url: "/sources",
    icon: Database,
  },
  {
    title: "Email Logs",
    url: "/emails",
    icon: Mail,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

const managementItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Zap,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2 py-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold">DataDrop</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Connected to Django Backend</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  );
}
