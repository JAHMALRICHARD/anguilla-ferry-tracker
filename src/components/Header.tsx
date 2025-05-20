"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useThemeContext } from "@/components/ThemeProvider";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  LogOutIcon,
  EditIcon,
} from "lucide-react";

type AppUser = {
  id: string;
  email: string;
  role: "admin" | "operator" | "public";
};

export function Header() {
  const { theme, toggleTheme } = useThemeContext();
  const [user, setUser] = useState<AppUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const fetchUserRole = async (userId: string): Promise<AppUser["role"]> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("roles!inner(name)") // forces join clarity
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data || !data.roles || !("name" in data.roles)) {
      console.warn("⚠️ Could not fetch role. Defaulting to 'public'");
      return "public";
    }
    console.log("🔍 Role Data:", data);
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
    setShowDropdown(false);
  };

  return (
    <header className="bg-[#151923] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          <button className="p-2 text-gray-400 hover:text-white">
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="relative max-w-sm w-full">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1E2A3B] text-gray-300 border border-transparent focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-[#1E2A3B] rounded-lg"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <button className="p-2 hover:bg-[#1E2A3B] rounded-lg relative">
            <BellIcon className="h-5 w-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-[#1E2A3B] rounded-lg py-1 px-2 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full overflow-hidden relative">
                  <Image
                    src="/profile/jrichard-head-photo-mqa.jpg"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-200">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1E2A3B] border border-gray-700 rounded-md shadow-lg z-50">
                  {user.role === "admin" && (
                    <button
                      onClick={() => router.push("/edit-schedule")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#252F3F] flex items-center gap-2"
                    >
                      <EditIcon className="h-4 w-4" />
                      Edit Schedule
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#252F3F] flex items-center gap-2"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1E2A3B] border border-gray-700 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-white text-lg font-semibold mb-4">
              Login to Ferry Tracker
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 px-3 py-2 rounded bg-[#151923] text-white border border-gray-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 px-3 py-2 rounded bg-[#151923] text-white border border-gray-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
