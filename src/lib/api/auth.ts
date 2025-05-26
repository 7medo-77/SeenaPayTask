"use server";
import axios from "axios";

// MockAPI base URL
const MOCKAPI_BASE_URL = process.env.MOCKAPI_BASE_URL;


// Axios instance for MockAPI
export const apiClient = axios.create({
	baseURL: MOCKAPI_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// basic ApiUser type
export interface ApiUser {
	id: string;
	username: string;
	email: string;
	password?: string;
}

// LoginCredentials and SignupData interfaces for user authentication
interface LoginCredentials {
	email: string;
	password: string;
}

interface SignupData {
	username: string;
	email: string;
	password: string;
}

interface AuthResponse {
	success: boolean;
	// the password not included for security reasons
	user?: Omit<ApiUser, "password">;
	error?: string;
}

/**
 * User log in server action.
 * DISCLAIMER: MOCKAPI account is free, so it does not have a login/ route.
 * Instead, I use a GET request to get all user emails and then check
 * if the user email exists in this list.
 * Parameters:
 * - credentials: LoginCredentials object containing email and password.
 * return: AuthResponse object with success status, user data without password, or error message.
 */
export const loginUser = async (
	credentials: LoginCredentials
): Promise<AuthResponse> => {
	try {
		// This approach is obviously not ideal, but is currently the best option
		const response = await apiClient.get<ApiUser[]>("/users");

		const users = response.data.filter(
			(user) => user.email === credentials.email
		);
		if (users.length === 0) {
			return { success: false, error: "User not found." };
		}

		const user = users[0];
		if (user.password !== credentials.password) {
			return { success: false, error: "Invalid password." };
		}

		// remove password, in accordance with the AuthResponse interface
		const { password, ...userWithoutPassword } = user;
		console.log(password);
		return { success: true, user: userWithoutPassword };

	} catch (error) {
		console.error("Login error:", error);
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				error: error.response.data.message || "Login failed. Please try again.",
			};
		}
		return {
			success: false,
			error: "Login failed due to a network or server error.",
		};
	}
};

/**
 * Disclaimer: This function is highly inefficient and is simply
 * a work-around to accomodate for lack of server-side error handling
 * Parameters:
 * - userData: SignupData object containing username, email, and password.
 * return: AuthResponse object with success status, user data without password, or error message.
 */
export const signupUser = async (
	userData: SignupData
): Promise<AuthResponse> => {
	try {
		const newUserPayload = {
			username: userData.username,
			email: userData.email,
			password: userData.password,
		};
		// Check if the user already exists, this is a workaround for MockAPI
		// as it does not have a built-in user registration endpoint.
		// Adding a new user with a pre-existing email will be successful because their IDs are different
		const response = await apiClient.get<ApiUser[]>("/users");
		const resultUser = response.data.find(
			(user) => user.email === userData.email || user.username === userData.username
		);

		if (resultUser) {
			return {
				success: false,
				error: "User with this email/username already exists.",
			};
		}

		const createResponse = await apiClient.post<ApiUser>(
			"/users",
			newUserPayload
		);

		if (!createResponse.data) {
			throw new Error("User creation failed");
		}

		const { password, ...createdUserWithoutPassword } = createResponse.data;
		console.log(password);
		return { success: true, user: createdUserWithoutPassword };

	} catch (error) {
		console.error("Signup error:", error);
		if (axios.isAxiosError(error) && error.response) {
			return {
				success: false,
				error:
					error.response.data.message || "Signup failed. Please try again.",
			};
		}
		return {
			success: false,
			error: "Signup failed due to a network or server error.",
		};
	}
};

// Signout is handled by next-Auth, so implementation is not necessary.
