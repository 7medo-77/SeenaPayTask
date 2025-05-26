"use server";
import getCurrentUserData from "@/utils/getCurrentUserData";
import { ApiUser } from "@/lib/api/auth";

// MockAPI base URL
const MOCKAPI_BASE_URL = process.env.MOCKAPI_BASE_URL;

export interface Post {
	id?: string;
	title: string;
	slug: string;
	description: string;
	content: string;
	userId: string;
	user?: ApiUser;
	createdAt?: string;
	updatedAt?: string;
}

export interface PostResponse {
	success: boolean;
	data?: Post | Post[];
	error?: string;
}

/**
 * Get all posts for a specific user
 * Parameters:
 * - userId: Optional user ID to fetch posts for. If not provided, it will try to get the current user's posts.
 * Return: PostResponse object containing success status, posts data, or error message.
 */
export const getUserPosts = async (userId?: string): Promise<PostResponse> => {
	try {
		// If userId is not provided, attempt to get the current user (from session)
		if (!userId) {
			const currentUser = await getCurrentUserData();
			if (!currentUser) {
				return { success: false, error: "User not authenticated" };
			}
			userId = currentUser.id;
		}

		const response = await fetch(`${MOCKAPI_BASE_URL}/users/${userId}/posts`);

		if (!response.ok) {
			const errorText = await response.text();
			console.log(`HTTP error ${response.status} for getUserPosts: ${errorText}`);
			return {
				success: true,
				data: [],
			};
		}

		const data: Post[] = await response.json();
		return { success: true, data: data };
	} catch (error) {
		console.log(error);
		return {
			success: true,
			data: [],
		};
	}
};

/**
 * Get all posts from the mock API
 * Return: PostResponse object containing success status, posts data, or error message.
 */
export const getAllPosts = async (): Promise<PostResponse> => {
	try {
		const response = await fetch(`${MOCKAPI_BASE_URL}/posts`);

		if (!response.ok) {
			let errorMessage = `Failed to fetch posts (HTTP ${response.status})`;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || "Failed to fetch posts";
			} catch (jsonError) {
				const errorText = await response.text();
				errorMessage = errorText || errorMessage;
			}
			console.error("Get all posts error (server response):", errorMessage);
			return { success: false, error: errorMessage };
		}

		const data: Post[] = await response.json();
		return { success: true, data: data };
	} catch (error) {
		console.error("Get all posts error (network or parsing):", error);
		return { success: false, error: "Network or server error" };
	}
};

/**
 * Get a specific post by ID
 */
export const getPostById = async (
	userId?: string,
	postId?: string
): Promise<PostResponse> => {
	try {
		if (!postId) {
			return { success: false, error: "Post ID is required" };
		}

		const postResponse = await fetch(`${MOCKAPI_BASE_URL}/posts/${postId}`);

		if (!postResponse.ok) {
			let errorMessage = `Failed to fetch post (HTTP ${postResponse.status})`;
			try {
				const errorData = await postResponse.json();
				errorMessage = errorData.message || errorData.error || "Failed to fetch post";
			} catch (jsonError) {
				const errorText = await postResponse.text();
				errorMessage = errorText || errorMessage;
			}
			console.error("Get post error (server response):", errorMessage);
			return { success: false, error: errorMessage };
		}

		const postData: Post = await postResponse.json();

		// Fetch user data
		if (postData.userId) {
			const userResponse = await fetch(`${MOCKAPI_BASE_URL}/users/${postData.userId}`);
			if (userResponse.ok) {
				const userDataResponse: ApiUser = await userResponse.json();
				const { password, ...rest } = userDataResponse;
				postData.user = rest; // Attach user data to the post
			} else {
				console.warn(`Failed to fetch user data for post ${postId} (HTTP ${userResponse.status})`);
			}
		}

		return { success: true, data: postData };
	} catch (error) {
		console.error("Get post by ID error (network or parsing):", error);
		return { success: false, error: "Network or server error" };
	}
};

/**
 * Create a new post
 */
export const createPost = async (
	postData: Omit<Post, "id">
): Promise<PostResponse> => {
	try {
		let authorId = postData.userId;
		if (!authorId) {
			const currentUser = await getCurrentUserData();
			if (!currentUser?.id) {
				return { success: false, error: "User not authenticated" };
			}
			authorId = currentUser.id;
		}

		const finalPostData = { ...postData, userId: authorId };

		const response = await fetch(
			`${MOCKAPI_BASE_URL}/users/${authorId}/posts`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(finalPostData),
			}
		);

		if (!response.ok) {
			let errorMessage = `Failed to create post (HTTP ${response.status})`;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || "Failed to create post";
			} catch (jsonError) {
				const errorText = await response.text();
				errorMessage = errorText || errorMessage;
			}
			console.error("Create post error (server response):", errorMessage);
			return { success: false, error: errorMessage };
		}

		const data: Post = await response.json();
		return { success: true, data: data };
	} catch (error) {
		console.error("Create post error (network or parsing):", error);
		return { success: false, error: "Network or server error" };
	}
};

/**
 * Update an existing post
 */
export const updatePost = async (
	postId: string,
	updateData: Partial<Post>
): Promise<PostResponse> => {
	try {
		if (!postId) {
			return { success: false, error: "Post ID is required" };
		}

		let userIdForPath = updateData.userId;
		if (!userIdForPath) {
			const currentUser = await getCurrentUserData();
			if (!currentUser?.id) {
				return { success: false, error: "User not authenticated" };
			}
			userIdForPath = currentUser.id;
		}

		const response = await fetch(
			`${MOCKAPI_BASE_URL}/users/${userIdForPath}/posts/${postId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updateData),
			}
		);

		if (!response.ok) {
			let errorMessage = `Failed to update post (HTTP ${response.status})`;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || "Failed to update post";
			} catch (jsonError) {
				const errorText = await response.text();
				errorMessage = errorText || errorMessage;
			}
			console.error("Update post error (server response):", errorMessage);
			return { success: false, error: errorMessage };
		}

		const data: Post = await response.json();
		return { success: true, data: data };
	} catch (error) {
		console.error("Update post error (network or parsing):", error);
		return { success: false, error: "Network or server error" };
	}
};

/**
 * Delete a post
 */
export const deletePost = async (
	userId?: string,
	postId?: string
): Promise<PostResponse> => {
	try {
		if (!postId) {
			return { success: false, error: "Post ID is required" };
		}

		let userIdForPath = userId;
		if (!userIdForPath) {
			const currentUser = await getCurrentUserData();
			if (!currentUser?.id) {
				return { success: false, error: "User not authenticated" };
			}
			userIdForPath = currentUser.id;
		}

		const response = await fetch(
			`${MOCKAPI_BASE_URL}/users/${userIdForPath}/posts/${postId}`,
			{
				method: "DELETE",
			}
		);

		if (!response.ok) {
			let errorMessage = `Failed to delete post (HTTP ${response.status})`;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || "Failed to delete post";
			} catch (jsonError) {
				const errorText = await response.text();
				errorMessage = errorText || errorMessage;
			}
			console.error("Delete post error (server response):", errorMessage);
			return { success: false, error: errorMessage };
		}

		return { success: true };
	} catch (error) {
		console.error("Delete post error (network or parsing):", error);
		return { success: false, error: "Network or server error" };
	}
};
