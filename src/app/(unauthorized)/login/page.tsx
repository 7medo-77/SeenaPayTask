// app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});
	const router = useRouter();

	const onSubmit = async (data: LoginForm) => {
		console.log("Login Data:", data);
		const response = await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false,
		});
		if (response?.error) {
			console.error("Login failed:", response);
		} else {
			console.log("Login successful");
			router.push("/");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-black p-6 rounded-xl shadow-md w-full max-w-sm"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

				<div className="mb-4">
					<label className="block mb-1 font-medium">Email</label>
					<input
						{...register("email")}
						className="w-full p-2 border rounded-md"
						placeholder="you@example.com"
					/>
					{errors.email && (
						<p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
					)}
				</div>

				<div className="mb-4">
					<label className="block mb-1 font-medium">Password</label>
					<input
						type="password"
						{...register("password")}
						className="w-full p-2 border rounded-md"
						placeholder="••••••••"
					/>
					{errors.password && (
						<p className="text-sm text-red-600 mt-1">
							{errors.password.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
				>
					Login
				</button>
			</form>
		</div>
	);
}
