"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Alternar modo noturno"
    >
      {mounted && isDark ? (
        <>
          <Sun size={16} />
          Claro
        </>
      ) : (
        <>
          <Moon size={16} />
          Escuro
        </>
      )}
    </button>
  );
}
