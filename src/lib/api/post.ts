"use server";
import axios from "axios";
import getCurrentUserData from "@/utils/getCurrentUserData";
import { apiClient, ApiUser } from "@/lib/api/auth";

// MockAPI base URL
const MOCKAPI_BASE_URL = process.env.MOCKAPI_BASE_URL;
console.log("MockAPI Base URL:", MOCKAPI_BASE_URL);

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
		console.log("userId: ", userId);
		console.log("url", `${process.env.MOCKAPI_BASE_URL}/users/${userId}/posts`);
		// MOCKAPI does not paginate the results
		const response = await apiClient.get<Post[]>(`/users/${userId}/posts`);
		console.log("response: ", response);
		return { success: true, data: response.data };

	} catch (error) {
		// console.error("Get posts error:", error);
		// if (axios.isAxiosError(error) && error.response) {
		// 	return {
		// 		success: false,
		// 		error: error.response.data.message || "Failed to fetch posts",
		// 	};
		// }
		// return { success: false, error: "Network or server error" };
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
		// Fetch all posts from the mock API
		const response = await apiClient.get<Post[]>("/posts");
		return { success: true, data: response.data };
	} catch (error) {
		console.error("Get all posts error:", error);
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				error: error.response.data.message || "Failed to fetch posts",
			};
		}
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

		// // If userId is not provided, try to get the current user (from session)
		// if (!userId) {
		// 	const currentUser = await getCurrentUserData();
		// 	if (!currentUser?.id) {
		// 		return { success: false, error: "User not authenticated" };
		// 	}
		// 	userId = currentUser.id;
		// }

		// const response = await apiClient.get<Post>(
		// 	`/users/${userId}/posts/${postId}`
		// );

		const response = await apiClient.get<Post>(
			`/posts/${postId}`
		);
		const userData = await apiClient.get<ApiUser>(`/users/${response.data.userId}`);
		const { password, ...rest } = userData.data;
		response.data.user = rest; // Attach user data to the post


		return { success: true, data: response.data };
	} catch (error) {
		console.error("Get post error:", error);
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				error: error.response.data.message || "Failed to fetch post",
			};
		}
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
		// If userId is not provided in postData, try to get the current user
		if (!postData.userId) {
			const currentUser = await getCurrentUserData();
			if (!currentUser?.id) {
				return { success: false, error: "User not authenticated" };
			}
			postData.userId = currentUser.id;
		}

		const response = await apiClient.post<Post>(
			`/users/${postData.userId}/posts`,
			postData
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("Create post error:", error);
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				error: error.response.data.message || "Failed to create post",
			};
		}
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

		// Get userId from updateData or get current user
		let userId = updateData.userId;
		if (!userId) {
			const currentUser = await getCurrentUserData();
			if (!currentUser?.id) {
				return { success: false, error: "User not authenticated" };
			}
			userId = currentUser.id;
		}

		const response = await apiClient.put<Post>(
			`/users/${userId}/posts/${postId}`,
			updateData
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("Update post error:", error);
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				error: error.response.data.message || "Failed to update post",
			};
		}
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

		// If userId is not provided, try to get the current user
		if (!userId) {
			const currentUser = await getCurrentUserData();
			if (!currentUser?.id) {
				return { success: false, error: "User not authenticated" };
			}
			userId = currentUser.id;
		}

		await apiClient.delete(`/users/${userId}/posts/${postId}`);
		return { success: true };
	} catch (error) {
		console.error("Delete post error:", error);
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				error: error.response.data.message || "Failed to delete post",
			};
		}
		return { success: false, error: "Network or server error" };
	}
};
