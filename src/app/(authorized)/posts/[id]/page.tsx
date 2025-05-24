import { getPostById, Post } from "@/lib/api/post";
import { notFound } from "next/navigation";
import PostDetail from "../../../components/post-details/post.component";

export default async function PostDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const response = await getPostById(undefined, id);

	if (!response.success || !response.data) {
		if (response.error?.includes("not authenticated")) {
			return (
				<div className="p-8 max-w-4xl mx-auto">
					<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
						You must be logged in to view this post.
					</div>
				</div>
			);
		}

		return notFound();
	}

	const post = response.data as Post;
	return <PostDetail post={post} />;
}
