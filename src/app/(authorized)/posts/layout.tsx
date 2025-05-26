import Link from "next/link";
import SignOutButton from "@/app/components/signout/signout.component";
import React from "react";
import getCurrentUserData from "@/utils/getCurrentUserData";

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUserData();
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center border p-6 rounded-lg shadow-lg bg-red-50 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-gray-600">You must be signed in to view this page.</p>
          <Link
            href="/login"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <nav className="flex items-center space-x-4 ">
          <Link
            href="/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Post
          </Link>
          <SignOutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}
