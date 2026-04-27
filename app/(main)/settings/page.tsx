"use client";

import { useState } from "react";
import { UserCircle, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import AvatarUpload from "@/components/settings/AvatarUpload";
import ProfileForm from "@/components/settings/ProfileForm";
import PhotoGrid from "@/components/photos/PhotoGrid";

type Tab = "profile" | "images";


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-6 py-2 max-w-5xl mx-auto w-full">

      {/* Page title */}
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
        Settings
      </h1>


      {/* ── PROFILE TAB ── */}
      {activeTab === "profile" && (
        <div className="w-full bg-white dark:bg-[#1a2235] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">

          {/* Avatar section */}
          <div className="px-6 py-6 border-b border-slate-100 dark:border-white/5">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Profile Photo
            </h2>
            <AvatarUpload />
          </div>

          {/* Form section */}
          <div className="px-6 py-6">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
              Personal Information
            </h2>
            <ProfileForm />
          </div>
        </div>
      )}

     

      <p className="text-slate-400 dark:text-slate-600 text-xs mt-auto pt-10 text-center">
        © 2025
      </p>
    </main>
  );
}
