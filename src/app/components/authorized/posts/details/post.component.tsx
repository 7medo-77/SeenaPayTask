"use client";
import { deletePost, Post } from "@/lib/api/cachedPost";
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
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface IPostDetailProps {
	post: Post;
	userIsOwner?: boolean;
}

export default function PostDetail({ post, userIsOwner }: IPostDetailProps) {
	const router = useRouter();
	return (
		<div className="p-4 md:p-8 max-w-4xl mx-auto">
			<div className="mb-6">
				<Link
					href="/posts"
					className="text-blue-600 hover:text-blue-800 flex items-center"
				>
					← Back to all posts
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold mb-2">{post.title}</CardTitle>
					<CardDescription className="text-sm text-gray-500 space-y-1">
						<div>
							{post.user?.username && (
								<>
									<span className="mx-2">•</span>
									<span>Author: {post.user.username}  </span>
								</>
							)}
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent>
					{post.description && (
						<div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
							<p className="italic text-gray-700">{post.description}</p>
						</div>
					)}

					<div className="prose max-w-none text-gray-800 leading-relaxed">
						{post.content.split("\n").map((paragraph, index) => (
							<p key={index} className="mb-4">
								{paragraph}
							</p>
						))}
					</div>
				</CardContent>

				{userIsOwner && (
					<CardFooter className="flex justify-between mt-6 pt-6 border-t">
						<Button asChild variant="outline">
							<Link href={`/posts/${post.id}/edit`}>Edit Post</Link>
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive">Delete Post</Button>
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
											// Consider adding error handling/toast here
											await deletePost(undefined, post.id);
											toast.success("Post deleted successfully!");
											router.push("/posts/view/my-posts");
										}}
										className="inline"
									>
										<AlertDialogAction
											type="submit"
										>
											Continue
										</AlertDialogAction>
									</form>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
