"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { Photo } from "@/types/photo";

export default function PhotoCard({ photo }: { photo: Photo }) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group flex flex-col bg-white dark:bg-[#1e2d42] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-sky-500/30 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-300">
      
      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-200 dark:bg-slate-800 overflow-hidden">

        {/* Skeleton */}
        {!loaded && !imgError && (
          <div className="absolute inset-0 animate-pulse bg-slate-300 dark:bg-slate-700" />
        )}

        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-700">
            <ImageOff className="w-8 h-8" />
          </div>
        ) : (
          <Image
            src={`https://picsum.photos/id/${photo.id}/300/300`}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 10vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadingComplete={() => setLoaded(true)}
            onError={() => setImgError(true)}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        )}

        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
          Album {photo.albumId}
        </span>
      </div>

      {/* Title */}
      <div className="p-3">
        <p className="text-slate-900 dark:text-white text-xs font-medium leading-relaxed line-clamp-2 capitalize transition-colors duration-300">
          {photo.title}
        </p>
      </div>
    </div>
  );
}