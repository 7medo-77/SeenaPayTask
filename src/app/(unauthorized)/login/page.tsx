// app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from 'react-toastify';

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const router = useRouter();
	const [apiError, setApiError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: LoginFormValues) => {
		setApiError(null);
		setLoading(true);
		console.log("Login Data:", data);
		try {
			const response = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});
			if (response?.error) {
				console.error("Login failed:", response);
				setApiError(
					response.error === "CredentialsSignin"
						? "Invalid email or password."
						: "Login failed. Please try again."
				);
				toast.error(apiError || "Login failed. Please try again.");
			} else if (response?.ok) {
				console.log("Login successful");
				toast.success("Login successful!");
				router.push("/");
				router.refresh();
			} else {
				setApiError("An unexpected error occurred during login.");
			}
		} catch (error) {
			console.error("Login submission error:", error);
			setApiError("An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (

		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
				<CardDescription className="text-center">
					Enter your credentials to access your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{apiError && (
					<div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
						{apiError}
					</div>
				)}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="you@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={loading} className="w-full">
							{loading ? "Logging in..." : "Login"}
						</Button>
					</form>
				</Form>
				<div className="mt-6 text-sm text-center">
					Don&apos;t have an account?{" "}
					<Link
						href="/signup"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>

	);
}
