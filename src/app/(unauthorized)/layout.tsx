import Image, { StaticImageData } from "next/image";
import backgroundAsset from '@/assets/faded_gallery-OfdOEdGYiuk-unsplash.jpg';
import React from "react";

interface UnauthorizedLayoutProps {
  children: React.ReactNode;
}

export default function UnauthorizedLayout({ children }: UnauthorizedLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white font-[family-name:var(--font-geist-sans)]">
      {/* Background Image */}
      <Image
        src={backgroundAsset} // Use the imported StaticImageData
        alt="Blog background"
        layout="fill"
        objectFit="cover"
        quality={75} // Reduced quality slightly for better performance, adjust as needed
        className="-z-10" // Ensure it's behind other content
        priority // Prioritize loading for LCP
        placeholder="blur" // Show a blurred placeholder while loading
        sizes="100vw"
      />

      {/* Overlay for backdrop blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-0"></div>

      {/* Page content will be rendered here */}
      <main className="z-10 w-full flex flex-col items-center justify-center p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
