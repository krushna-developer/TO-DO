"use client";

import { useState } from "react";
import { Menu, ListTodo, Settings, Images } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function AppSidebar({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const displayName   = profile.name     || user?.name  || "User";
  const displayEmail  = profile.email    || user?.email || "";
  const displayAvatar =
    profile.avatarUrl ||
    user?.avatarUrl   ||
    `https://i.pravatar.cc/100?u=${displayEmail}`;

  const navItems = [
    { label: "My Tasks",      icon: <ListTodo className="w-6 h-6 font-bold shrink-0" />,  href: "/"              },
    { label: "Settings",      icon: <Settings className="w-6 h-6 font-bold shrink-0" />,  href: "/settings"      },
    { label: "Image Details", icon: <Images   className="w-6 h-6 font-bold shrink-0" />,  href: "/image-details" },
  ];

  return (
    <div
      className={`h-full bg-slate-50 dark:bg-[#253246] text-slate-900 dark:text-white flex flex-col transition-all duration-300 border-r border-slate-200 dark:border-white/5 ${
        isMobile ? "w-full" : open ? "w-64" : "w-16"
      }`}
    >
      {/* MENU BUTTON — desktop only */}
      {!isMobile && (
        <div className="p-5 pt-8">
          <Menu
            className="cursor-pointer w-6 h-6"
            onClick={() => setOpen((p) => !p)}
          />
        </div>
      )}

      <div className={`${isMobile ? "pt-10" : ""} flex flex-col h-full`}>

        {/* PROFILE */}
        <div
          className={`flex flex-col items-center gap-2 mt-4 transition-all ${
            !open && !isMobile ? "hidden" : ""
          }`}
        >
          <div className="relative w-16 h-16 mb-4 rounded-full overflow-hidden ring-2 ring-white/10">
            <Image
              src={displayAvatar}
              alt={displayName}
              fill
              sizes="64px"
              className="object-cover "
              unoptimized={displayAvatar.startsWith("data:")}
            />
          </div>
          <p className="font-medium text-base dark:text-[#FFFFFF] truncate max-w-[80%]">{displayName}</p>
          <p className="text-xs text-slate-500 dark:text-[#99A1AF] truncate max-w-[80%]">{displayEmail}</p>
        </div>

        <div className={`h-px bg-slate-200 dark:bg-[#6A7282] ${open ? "mx-6 my-6" : "mx-2 my-3"}`} />

        {/* NAV ITEMS */}
        <div className={`flex flex-col gap-3 ${open && !isMobile ? "px-5" : "p-2"}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center ${
                  open || isMobile ? "gap-6 px-4" : "justify-center"
                } py-2.5 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? "bg-slate-200 text-slate-900 dark:bg-white dark:text-black/80 font-bold"
                    : "text-slate-600 dark:text-[#FFFFFF] hover:bg-slate-100 hover:text-slate-900 font-bold dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {item.icon}
                {(open || isMobile) && (
                  <span className="text-md font-medium">{item.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
