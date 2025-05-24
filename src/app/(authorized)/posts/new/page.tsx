"use client";

import { Post, createPost } from "@/lib/api/post";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const postFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().min(1, "Description is required"),
	content: z.string().min(1, "Content is required"),
});

type PostFormValues = z.infer<typeof postFormSchema>;

export default function NewPostPage() {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const form = useForm<PostFormValues>({
		resolver: zodResolver(postFormSchema),
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			content: "",
		},
		mode: "onChange",
	});

	const generateSlug = () => {
		const title = form.getValues("title");
		if (title) {
			const slug = title
				.toLowerCase()
				.replace(/[^\w\s-]/gi, "") // remove all non-word characters except spaces and hyphens
				.replace(/\s+/g, "-");
			form.setValue("slug", slug, { shouldValidate: true });
		}
	};

	const onSubmit = async (values: PostFormValues) => {
		try {
			setApiError(null);
			setSubmitting(true);

			const postData: Omit<Post, "id"> = {
				...values,
				userId: "",
			};

			const response = await createPost(postData);

			if (response.success && response.data) {
				const newPost = response.data as Post;
				toast.success("Post created successfully!");
				router.push(`/posts/${newPost.id}`);
			} else {
				setApiError(response.error || "Failed to create post");
			}
		} catch (err) {
			setApiError("An unexpected error occurred");
			toast.error("An unexpected error occurred while creating the post.");
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

			{apiError && (
				<div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
					{apiError}
				</div>
			)}

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
									<Input
										placeholder="Enter post title"
										{...field}
										onBlur={() => {
											field.onBlur();
											generateSlug();
										}}
									/>
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
								<div className="flex">
									<FormControl>
										<Input placeholder="post-slug" {...field} />
									</FormControl>
									<Button
										type="button"
										variant="outline"
										onClick={generateSlug}
										className="ml-2"
									>
										Generate
									</Button>
								</div>
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

					<div className="flex justify-end">
						<Button type="submit" disabled={submitting}>
							{submitting ? "Creating..." : "Create Post"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
