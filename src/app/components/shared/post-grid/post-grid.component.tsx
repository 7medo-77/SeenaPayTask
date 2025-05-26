"use client";

import { Post } from "@/lib/api/cachedPost";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function PostGridComponent({ posts }: { posts: Post[] }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // State to manage the search term
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts by title..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {
        posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl text-gray-600">No posts found</h3>
            <p className="mt-2 text-gray-500">
              Create your first post to get started.
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl text-gray-600">No posts match your search</h3>
            <p className="mt-2 text-gray-500">
              Try a different search term or clear the search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow hover:cursor-pointer hover:border-blue-300 duration-300 hover:scale-105 "
              >
                <div className="p-5">
                  <Link href={`/posts/${post.id}`} className="text-xl font-semibold mb-2 line-clamp-2 hover:animate-pulse">
                    {post.title}
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    {post.createdAt && (
                      <span>Posted on {formatDate(post.createdAt)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                    {
                      post.userId === currentUserId && (<div className="flex space-x-2">
                        <Link
                          href={`/posts/${post.id}/edit`}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Edit
                        </Link>
                      </div>
                      )
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </section>
  )
}