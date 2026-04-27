"use client";

import Sidebar from "@/components/AppSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user,_hasHydrated } = useAuthStore();
  const router = useRouter();
useEffect(() => {
    // Wait until Zustand has rehydrated from localStorage before checking auth
    if (!_hasHydrated) return;
    if (!user) router.push("/login");
  }, [user, _hasHydrated]);
 
  // Show nothing while store is hydrating — prevents the blink
  if (!_hasHydrated) return null;
 
  // Still null after hydration means not logged in — don't flash the app
  if (!user) return null;
  return (
    <div className="flex h-screen overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">

      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content (SCROLLABLE) */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-[#101828]">
          {children}
        </main>

      </div>
    </div>
  );
}