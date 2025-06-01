"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface UserInfo {
  full_name: string;
  email: string;
  role: string;
  id: string;
}

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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

  return userInfo;
}
