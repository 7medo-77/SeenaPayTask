"use client";

import React, { useState } from "react";
import { signupUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";

export default function SignupPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!formData.email || !formData.password) {
			setError("Email and password are required");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			setLoading(true);
			const response = await signupUser({
				username: formData.name,
				email: formData.email,
				password: formData.password,
			});

			if (response.success && response.user) {
				toast.success("Account created successfully! Redirecting to login...");
				router.push("/login");
			} else {
				setError(response.error || "Signup failed");
				toast.error(response.error || "Signup failed");
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold tracking-tight text-center">
						Create your account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your details below to create a new account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
							{error}
						</div>
					)}
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Your name"
								value={formData.name}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email address</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="you@example.com"
								required
								value={formData.email}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								value={formData.password}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="••••••••"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
							/>
						</div>

						<Button
							type="submit"
							disabled={loading}
							className="w-full"
						>
							{loading ? "Creating account..." : "Sign up"}
						</Button>
					</form>
					<div className="mt-6 text-sm text-center">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
