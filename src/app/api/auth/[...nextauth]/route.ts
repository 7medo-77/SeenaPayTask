import { loginUser } from "@/lib/api/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
			},
			async authorize(credentials) {
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
		},
		async jwt({ token, user, trigger, session }) {
		},
		async redirect({ url }) {
		},
	},
});

export { handler as GET, handler as POST };
