// 'use client'

// import { useThemeContext } from './ThemeProvider'
// import { Moon, Sun } from 'lucide-react'

// export default function ThemeToggle() {
//   const { theme, toggleTheme } = useThemeContext()

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-md text-xl hover:text-blue-400"
//       aria-label="Toggle Theme"
//     >
//       {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//     </button>
//   )
// }

"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch on server-side render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md text-xl hover:text-blue-400 transition"
      aria-label="Toggle Theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
