import { getPostById, Post } from "@/lib/api/cachedPost";
import { notFound } from "next/navigation";
import PostDetail from "../../../components/authorized/posts/details/post.component";
import getCurrentUserData from "@/utils/getCurrentUserData";

export default async function PostDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// Check if the user is authenticated and get their ID,
	//  then check if they are the owner of the post
	const { id: userId } = await getCurrentUserData();
	const response = await getPostById(undefined, id);
	const userIsOwner = userId && response.data?.userId === userId;

	// If the post is not found or the user is not authenticated,
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
		// If the post is not found, return a 404 page
		if (response.error?.includes("not found")) {
			return notFound();
		}
		// If there was an error fetching the post,
		if (response.error) {
			return (
				<div className="p-8 max-w-4xl mx-auto">
					<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
						Error loading post: {response.error || "Unknown error"}
					</div>
				</div>
			);
		}

		return notFound();
	}

	const post = response.data as Post;
	return <PostDetail post={post} userIsOwner={userIsOwner} />;
}
