"use client";

import PhotoGrid from "@/components/photos/PhotoGrid";
import { Images } from "lucide-react";

export default function ImageDetailsPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 pt-8 w-full max-w-[1400px] mx-auto">
      {/* Header */}

      {/* Card wrapper */}
      <div className="w-full  p-4 sm:p-6">
        <PhotoGrid />
      </div>

      <p className="text-slate-600 text-xs mt-auto pt-12">© 2025</p>
    </main>
  );
}
