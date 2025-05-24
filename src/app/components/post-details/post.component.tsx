"use client";
import { deletePost, Post } from "@/lib/api/post";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PostDetail({ post }: { post: Post }) {
	const router = useRouter();
	return (
		<div className="p-8 max-w-4xl mx-auto">
			<div className="mb-6">
				<Link
					href="/posts"
					className="text-blue-600 hover:text-blue-800 flex items-center"
				>
					← Back to all posts
				</Link>
			</div>

			<article className="bg-white rounded-lg shadow-sm p-8">
				<header className="mb-8">
					<h1 className="text-3xl font-bold mb-4">{post.title}</h1>

					<div className="flex items-center text-sm text-gray-500 mb-4">
						<span>Post ID: {post.id}</span>
						<span className="mx-2">•</span>
						<span>Slug: {post.slug}</span>
						<span className="mx-2">•</span>
						<span>User ID: {post.userId}</span>
					</div>

					<div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
						<p className="italic text-gray-700">{post.description}</p>
					</div>
				</header>

				<div className="prose max-w-none text-gray-800 leading-relaxed">
					{post.content.split("\n").map((paragraph, index) => (
						<p key={index} className="mb-4">
							{paragraph}
						</p>
					))}
				</div>
			</article>

			<div className="mt-8 flex justify-between">
				<Link
					href={`/posts/${post.id}/edit`}
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
				>
					Edit Post
				</Link>

				{/* confirmation dialog for deleting the post */}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<button
							type="button"
							className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
						>
							Delete Post
						</button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete
								this post and remove its data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<form
								action={async () => {
									await deletePost(undefined, post.id);
									router.push("/posts");
								}}
								className="inline"
							>
								<AlertDialogAction
									type="submit"
									className="bg-red-600 hover:bg-red-700"
								>
									Continue
								</AlertDialogAction>
							</form>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

			</div>
		</div>
	);
}
