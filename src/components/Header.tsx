"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import {
  Home,
  Calendar,
  MapPin,
  Bell,
  User,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  LogOut,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

type AppUser = {
  id: string;
  email: string;
  role: "admin" | "operator" | "public";
};

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserRole = async (userId: string): Promise<AppUser["role"]> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("roles!inner(name)")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data || !data.roles || !("name" in data.roles)) {
      console.warn("⚠️ Could not fetch role. Defaulting to 'public'");
      return "public";
    }

    return data.roles.name as AppUser["role"];
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email ?? "unknown@example.com",
          role,
        });
      }
    };
    getSession();
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data?.user) {
      const role = await fetchUserRole(data.user.id);
      setUser({
        id: data.user.id,
        email: data.user.email ?? "unknown@example.com",
        role,
      });
      setIsLoginModalOpen(false);
    } else {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navigationItems = [
    { name: "Home", icon: Home },
    { name: "Schedule", icon: Calendar },
    { name: "Track", icon: MapPin },
    { name: "Alerts", icon: Bell },
    { name: "Profile", icon: User },
  ];

  return (
    <header className="bg-background text-foreground border-b border-border sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="text-xl font-bold">Ferry Tracker</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1">
          {navigationItems.map(({ name, icon: Icon }) => (
            <Button
              key={name}
              variant="ghost"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Icon className="h-4 w-4" />
              {name}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition-transform duration-300 hover:rotate-12"
          >
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 transition-all duration-300" />
              ) : (
                <Moon className="h-5 w-5 transition-all duration-300" />
              ))}
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {user ? (
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
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <Edit className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant="ghost"
                className="w-full flex items-center gap-2 text-sm font-medium"
              >
                <Icon className="h-4 w-4" />
                {name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background text-foreground border border-border p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">
              Login to Ferry Tracker
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsLoginModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleLogin}>Sign In</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
