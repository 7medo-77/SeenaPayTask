import { loginUser } from "@/lib/api/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;

				const res = await loginUser({
					email: credentials.email,
					password: credentials.password,
				});
				console.log(res, "res");

				if (res.success && res.user) {
					return res.user;
				} else {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			session.user = token.user as
				| { name?: string | null; email?: string | null }
				| undefined;
			return session;
		},
		async jwt({ token, user, trigger, session }) {
			if (trigger === "update") {
				token.user = session.user;
			}

			if (user) {
				token.user = user;
			}
			return token;

		},
		async redirect({ url }) {
			console.log(url, "redirect pre");
			const baseUrl = url.split("/").slice(0, 3).join("/");
			console.log(baseUrl, "redirect post");
			return baseUrl;
		},
	},
});

export { handler as GET, handler as POST };
