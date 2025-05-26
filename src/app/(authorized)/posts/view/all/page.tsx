import { getAllPosts, Post } from "@/lib/api/cachedPost";
import PostGridComponent from "@/app/components/shared/post-grid/post-grid.component";

export default async function AllPostsPage() {
  const postResponse = await getAllPosts();

  let posts: Post[] = [];
  if (postResponse.success && postResponse.data) {
    // Ensure result is an array
    posts = Array.isArray(postResponse.data) ? postResponse.data : [];
  } else if (!postResponse.success) {
    console.error("Failed to fetch all posts:", postResponse.error);
  }

  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-8">All Posts</h1> */}
      <PostGridComponent posts={posts} />
    </div>
  );
}
