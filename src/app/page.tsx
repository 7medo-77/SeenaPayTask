import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import backgroundAsset from '@/assets/faded_gallery-OfdOEdGYiuk-unsplash.jpg';

export default async function Home() {
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

			{/* Hero Section - ensure it's above the overlay */}
			<main className="z-10 flex flex-col items-center justify-center text-center p-8 relative">
				<h1 className="text-5xl sm:text-7xl font-bold mb-8">
					Blog Application
				</h1>

				{/* Action Buttons */}
				<div className="flex gap-4 items-center flex-col sm:flex-row">
					<Link
						href="/signup"
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
					>
						Sign Up
					</Link>
					<Link
						href="/login"
						className="rounded-full border border-solid border-white/[.8] hover:bg-white/[.1] transition-colors flex items-center justify-center text-white text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
					>
						Login
					</Link>
				</div>
			</main>
		</div>
	);
}
