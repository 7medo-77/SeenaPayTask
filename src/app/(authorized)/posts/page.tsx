import { getUserPosts, Post } from "@/lib/api/post";
import Link from "next/link";
import SignOutButton from "@/app/components/signout/signout.component";

// Helper function to format date
const formatDate = (dateString?: string) => {
	if (!dateString) return "Unknown date";
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export default async function PostsPage() {
	const response = await getUserPosts();

	if (!response.success) {
		if (response.error?.includes("not authenticated")) {
			// This should be handled by middleware, but just in case
			return (
				<div className="p-8 max-w-5xl mx-auto">
					<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
						You must be logged in to view posts.
					</div>
				</div>
			);
		}

		return (
			<div className="p-8 max-w-5xl mx-auto">
				<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
					Error loading posts: {response.error || "Unknown error"}
				</div>
			</div>
		);
	}

	const posts = response.data as Post[];

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">My Posts</h1>
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

			{posts.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<h3 className="text-xl text-gray-600">No posts found</h3>
					<p className="mt-2 text-gray-500">
						Create your first post to get started.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.map((post) => (
						<div
							key={post.id}
							className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow hover:cursor-pointer hover:border-blue-300 duration-300 hover:scale-105 "
						>
							<div className="p-5">
								<Link href={`/posts/${post.id}`} className="text-xl font-semibold mb-2 line-clamp-2 hover:animate-pulse">
									{post.title}
								</Link>
								{/* <h2 className="text-xl font-semibold mb-2 line-clamp-2 hover:animate-pulse ">
									{post.title}
								</h2> */}
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
									<div className="flex space-x-2">
										<Link
											href={`/posts/${post.id}/edit`}
											className="text-gray-600 hover:text-gray-800"
										>
											Edit
										</Link>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
