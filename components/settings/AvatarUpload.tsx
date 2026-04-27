"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Trash2, Upload } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function AvatarUpload() {
  const { profile, updateAvatar } = useProfileStore();
  const { user } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const avatarSrc =
    profile.avatarUrl ||
    user?.avatarUrl ||
    `https://i.pravatar.cc/100?u=${user?.email}`;

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Image must be under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => updateAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => updateAvatar("");

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      {/* Avatar with overlay actions */}
      <div className="relative shrink-0 group">
        <div
          className={`w-24 h-24 rounded-2xl overflow-hidden ring-2 transition-all duration-200 cursor-pointer
            ${isDragging
              ? "ring-sky-400 ring-offset-2 ring-offset-[#1a2235] scale-105"
              : "ring-white/10 hover:ring-sky-400/50"
            }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Image
            src={avatarSrc}
            alt="Profile avatar"
            fill
            sizes="96px"
            className="object-cover"
            unoptimized={avatarSrc.startsWith("data:")}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Remove badge */}
        {profile.avatarUrl && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg transition-colors"
            title="Remove photo"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      {/* Info + upload zone */}
      <div className="flex flex-col gap-3 flex-1 w-full sm:w-auto">
        {/* Name / email preview */}
        <div>
          <p className="text-black dark:text-white font-semibold text-base leading-tight">
            {profile.fullName || profile.name || user?.name || "Your Name"}
          </p>
          <p className="text-slate-400 text-sm mt-0.5">
            {profile.email || user?.email || ""}
          </p>
          {profile.bio && (
            <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xs">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 select-none
            ${isDragging
              ? "border-sky-400 bg-sky-400/10 scale-[1.01]"
              : "border-white/10 hover:border-sky-400/50 hover:bg-white/5"
            }`}
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <p className="text-white text-xs font-medium">
              Click or drag & drop to upload
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              PNG, JPG, WEBP · max 3MB
            </p>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
