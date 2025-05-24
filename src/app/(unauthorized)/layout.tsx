import Image from "next/image";
import backgroundAsset from '@/assets/faded_gallery-OfdOEdGYiuk-unsplash.jpg';
import React from "react";
import getCurrentUserData from "@/utils/getCurrentUserData";
import { redirect } from "next/navigation";

interface UnauthorizedLayoutProps {
  children: React.ReactNode;
}

// server component is async becuase of the getCurrentUserData function
export default async function UnauthorizedLayout({ children }: UnauthorizedLayoutProps) {
  const user = await getCurrentUserData()
  if (user) {
    // If user is authenticated, redirect to the home page
    redirect('/posts');
  }

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

      <main className="z-10 w-full flex flex-col md:flex-row items-center justify-between p-2 md:p-[4em] sm:p-8 border-b border-white/10 bg-black/50 rounded-lg shadow-lg md:max-w-5xl">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-8">
          Blog Application
        </h1>

        {children}
      </main>
    </div>
  );
}
