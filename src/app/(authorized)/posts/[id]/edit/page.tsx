"use client";

import { Post, getPostById, updatePost } from "@/lib/api/cachedPost";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import EditPostFormComponent from "@/app/components/authorized/posts/edit/edit-post.component";

const editPostFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().min(1, "Description is required"),
	content: z.string().min(1, "Content is required"),
});

type EditPostFormValues = z.infer<typeof editPostFormSchema>;

export default function EditPostPage() {
	const params = useParams();
	const router = useRouter();
	const postId = params.id as string;
	const { data: sessionObject } = useSession();
	const userId = sessionObject?.user?.id;

	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [originalPostUserId, setOriginalPostUserId] = useState<string | null>(null);

	const form = useForm<EditPostFormValues>({
		resolver: zodResolver(editPostFormSchema),
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			content: "",
		},
		mode: "onChange",
	});

	useEffect(() => {
		async function fetchPost() {
			if (!sessionObject || !userId) {
				if (sessionObject === null) {
					setApiError("User not authenticated");
					toast.error("User not authenticated. Redirecting...");
					router.push("/auth/signin");
					setLoading(false);
					return;
				}
				if (!userId && sessionObject) {
					setApiError("User ID not found in session");
					toast.error("User ID not found in session. Redirecting...");
					router.push("/auth/signin");
					setLoading(false);
					return;
				}
				if (sessionObject === undefined) {
					return;
				}
			}

			try {
				setLoading(true);
				setApiError(null);
				const response = await getPostById(undefined, postId);

				if (response?.data && (response.data as Post).userId !== userId) {
					setApiError("You do not have permission to edit this post");
					toast.error("You do not have permission to edit this post, redirecting...");
					router.push(`/posts/${postId}`);
					setLoading(false);
					return;
				}

				if (!response.success || !response.data) {
					setApiError(response.error || "Failed to load post");
					setLoading(false);
					return;
				}
				const postData = response.data as Post;
				form.reset({
					title: postData.title,
					slug: postData.slug,
					description: postData.description,
					content: postData.content,
				});
				setOriginalPostUserId(postData.userId);
			} catch (err) {
				setApiError("An unexpected error occurred while loading the post");
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		if (postId && sessionObject !== undefined) {
			fetchPost();
		}
	}, [postId, form, sessionObject, userId, router]);

	const onSubmit = async (values: EditPostFormValues) => {
		try {
			setApiError(null);
			setSubmitting(true);

			const updateData: Partial<Post> = {
				...values,
				userId: originalPostUserId || undefined,
			};

			const response = await updatePost(postId, updateData);

			if (response.success) {
				toast.success("Post updated successfully!");
				router.push(`/posts/${postId}`);
			} else {
				toast.error(response.error || "Failed to update post");
				setApiError(response.error || "Failed to update post");
			}
		} catch (err) {
			setApiError("An unexpected error occurred");
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<div className="mb-6">
				<Link
					href={`/posts/${postId}`}
					className="text-blue-600 hover:text-blue-800 flex items-center"
				>
					← Back to post
				</Link>
			</div>

			<h1 className="text-3xl font-bold mb-6">Edit Post</h1>

			{loading ? (
				<div className="flex flex-col justify-center items-center py-8 h-96">
					<Loader2 className="h-20 w-20 animate-spin text-blue-600" />
				</div>
			) : apiError ? (
				<div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
					{apiError}
				</div>
			) : (
				<EditPostFormComponent
					form={form}
					onFormSubmit={form.handleSubmit(onSubmit)}
					submitting={submitting}
					postId={postId}
				/>
			)}
		</div>
	);
}
