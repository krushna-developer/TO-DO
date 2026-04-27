import Image from "next/image";

export default function EmptyState({ hasFilter = false }) {
  return (
    <div className="flex justify-center w-full">
      
      {/* Wrapper (relative is key) */}
      <div className="relative w-full max-w-3xl">

        {/* Image */}
        <div className="relative w-[80vw] sm:w-[380px] md:w-[400px] lg:w-[450px] aspect-square">
          <Image
            src="/assets/selfie.svg"
            alt="Empty"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text (anchored to image edge) */}
        <div className="absolute top-1/2 left-[60%] sm:left-[40%] md:left-[55%] lg:left-[50%] -translate-y-1/2 w-[40%]">
          {hasFilter ? (
            <>
              <p className="text-slate-600 dark:text-[#FFFFFF] text-xs sm:text-sm italic transition-colors duration-300">
                Nothing here yet 👀
              </p>
              <p className="text-slate-600 dark:text-[#FFFFFF] text-xs sm:text-sm italic mt-1 transition-colors duration-300">
                Try switching the filter above!
              </p>
            </>
          ) : (
            <>
              <p className="text-slate-600 dark:text-[#FFFFFF] text-xs sm:text-sm italic transition-colors duration-300">
                Empty as my motivation on Monday 😅.
              </p>
              <p className="text-slate-600 dark:text-[#FFFFFF] text-xs sm:text-sm italic mt-1 transition-colors duration-300">
                Let’s start adding stuff!
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}