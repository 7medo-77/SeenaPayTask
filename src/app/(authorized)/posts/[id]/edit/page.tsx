"use client";

import { Post, getPostById, updatePost } from "@/lib/api/post";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

const editPostFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().min(1, "Description is required"),
	content: z.string().min(1, "Content is required"),
});

type EditPostFormValues = z.infer<typeof editPostFormSchema>;

export default function EditPostPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const { id: postId } = params;

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
			try {
				setLoading(true);
				setApiError(null);
				const response = await getPostById(undefined, postId);

				if (!response.success || !response.data) {
					setApiError(response.error || "Failed to load post");
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

		if (postId) {
			fetchPost();
		}
	}, [postId, form]);

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

			{apiError && (
				<div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
					{apiError}
				</div>
			)}

			{loading ? (
				<div className="flex flex-col justify-center items-center py-8 h-96">
					<Loader2 className="h-20 w-20 animate-spin text-blue-600" />
				</div>
			) : (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Enter post title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug</FormLabel>
									<FormControl>
										<Input placeholder="post-slug" {...field} />
									</FormControl>
									<FormDescription>
										Used for URL: /posts/your-slug
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Short description of the post"
											rows={2}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Write your post content here..."
											rows={8}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Use line breaks to separate paragraphs.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-4">
							<Button type="button" variant="outline" asChild>
								<Link href={`/posts/${postId}`}>Cancel</Link>
							</Button>
							<Button type="submit" disabled={submitting}>
								{submitting ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}
