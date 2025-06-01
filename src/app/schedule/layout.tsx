import { Sidebar } from "@/components/Dashboard/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <SidebarInset className="flex-1 p-6">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
