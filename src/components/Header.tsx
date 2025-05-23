"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useThemeContext } from "@/components/ThemeProvider";
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
  ChevronDown,
  LogOut,
  Edit,
  Menu,
} from "lucide-react";

type AppUser = {
  id: string;
  email: string;
  role: "admin" | "operator" | "public";
};

export default function Header() {
  const { theme, toggleTheme } = useThemeContext();
  const [user, setUser] = useState<AppUser | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const navigationItems = [
    { name: "Home", icon: Home },
    { name: "Schedule", icon: Calendar },
    { name: "Track", icon: MapPin },
    { name: "Alerts", icon: Bell },
    { name: "Profile", icon: User },
  ];

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
    setShowUserDropdown(false);
  };

  const themeClasses =
    theme === "dark"
      ? "bg-slate-950 text-white border-slate-800"
      : "bg-white text-slate-900 border-slate-200";

  //const secondaryBg = theme === "dark" ? "bg-slate-800" : "bg-slate-100";
  const hoverBg =
    theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100";
  const mutedText = theme === "dark" ? "text-slate-400" : "text-slate-600";

  return (
    <header className={`${themeClasses} border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">Ferry Tracker</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1">
          {navigationItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${hoverBg} ${mutedText}`}
            >
              <Icon className="h-4 w-4" />
              {name}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`p-2 rounded-md ${hoverBg}`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-md ${hoverBg}`}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button className={`p-2 rounded-md ${hoverBg} relative`}>
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2 p-2 rounded-md ${hoverBg}`}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full overflow-hidden">
                  <Image
                    src="/profile/jrichard-head-photo-mqa.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">
                    {user.email.split("@")[0]}
                  </p>
                  <p className={`text-xs ${mutedText}`}>{user.role}</p>
                </div>
                <ChevronDown className={`h-4 w-4 ${mutedText}`} />
              </button>

              {showUserDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-56 ${themeClasses} border rounded-lg shadow-lg z-50`}
                >
                  <div className="px-3 py-2 border-b border-slate-700">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className={`text-xs ${mutedText}`}>{user.role}</p>
                  </div>
                  {user.role === "admin" && (
                    <button
                      onClick={() => router.push("/edit-schedule")}
                      className={`w-full text-left px-3 py-2 text-sm ${hoverBg} flex items-center gap-2`}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Schedule
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-3 py-2 text-sm ${hoverBg} flex items-center gap-2 text-red-500`}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className={`md:hidden border-t ${
            theme === "dark" ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${hoverBg} ${mutedText}`}
              >
                <Icon className="h-4 w-4" />
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className={`${themeClasses} border p-6 rounded-lg shadow-xl w-full max-w-md mx-4`}
          >
            <h2 className="text-lg font-semibold mb-4">
              Login to Ferry Tracker
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className={`px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
