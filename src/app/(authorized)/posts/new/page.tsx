"use client";

import { Post, createPost } from "@/lib/api/cachedPost";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
	CreatePostForm,
	PostFormValues,
} from "@/app/components/authorized/posts/new/create-post.component";

export default function NewPostPage() {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const onSubmit = async (values: PostFormValues) => {
		try {
			setApiError(null);
			setSubmitting(true);

			const postData: Omit<Post, "id"> = {
				...values,
				userId: "", // Replace with actual user ID if available
			};

			const response = await createPost(postData);

			if (response.success && response.data) {
				const newPost = response.data as Post;
				toast.success("Post created successfully!");
				router.push(`/posts/${newPost.id}`);
			} else {
				setApiError(response.error || "Failed to create post");
				toast.error(response.error || "Failed to create post");
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An unexpected error occurred";
			setApiError(errorMessage);
			toast.error(
				`${errorMessage} while creating the post.`
			);
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<div className="mb-6">
				<Link
					href="/posts"
					className="text-blue-600 hover:text-blue-800 flex items-center"
				>
					← Back to posts
				</Link>
			</div>

			<h1 className="text-3xl font-bold mb-6">Create New Post</h1>

			<CreatePostForm
				onFormSubmit={onSubmit}
				isSubmitting={submitting}
				formApiError={apiError}
			/>
		</div>
	);
}
