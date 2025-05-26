import { redirect } from "next/navigation";

export default async function PostsPage() {
	redirect("/posts/view/all");
}
