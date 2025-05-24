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
        src={backgroundAsset}
        alt="Blog background"
        layout="fill"
        objectFit="cover"
        quality={75}
        className="-z-10"
        priority
        placeholder="blur"
        sizes="100vw"
      />

      {/* Overlay for backdrop blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-0"></div>

      <main className="z-10 w-full flex flex-col items-center justify-center p-4 sm:p-8">
        <h1 className="text-5xl sm:text-7xl font-bold mb-8">
          Blog Application
        </h1>

        {children}
      </main>
    </div>
  );
}
