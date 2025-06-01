// utils/logout.ts
import { supabase } from "@/utils/supabase";

export const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.reload();
};
