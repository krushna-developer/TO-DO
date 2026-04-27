"use client";

import { useState } from "react";
import { Sun, Moon, Menu } from "lucide-react";
import MobileSidebar from "@/components/MobileSidebar";
import { useThemeStore } from "@/store/useThemeStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  const isDark = theme === "dark" || (theme === "system" && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex bg-white dark:bg-[#101828] items-center justify-between md:justify-end px-6 pt-4 pb-4 transition-colors duration-300">
      
      {/* LEFT → only on mobile */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
        
        <MobileSidebar 
          open={isOpen} 
          onOpenChange={setIsOpen} 
        />
      </div>

      {/* RIGHT → always */}
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-slate-900 dark:text-white" />
        ) : (
          <Moon className="w-5 h-5 text-slate-900 dark:text-white" />
        )}
      </button>

    </div>
  );
}