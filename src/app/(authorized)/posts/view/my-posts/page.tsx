import getCurrentUserData from "@/utils/getCurrentUserData";
import { getUserPosts, Post } from "@/lib/api/cachedPost";
import PostGridComponent from "@/app/components/authorized/posts/grid/post-grid.component";

export default async function MyPostsPage() {
  const currentUser = await getCurrentUserData();

  if (!currentUser || !currentUser.id) {
    return (
      <div>
        <h1>My Posts</h1>
        <p>User not authenticated. Please log in to see your posts.</p>
      </div>
    );
  }

  const postResponse = await getUserPosts(currentUser.id);

  let posts: Post[] = [];
  if (postResponse.success && postResponse.data) {
    posts = Array.isArray(postResponse.data) ? postResponse.data : [postResponse.data];
  } else if (!postResponse.success) {
    console.error("Failed to fetch posts:", postResponse.error);
    // PostGridComponent will handle the empty posts array
  }

  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-8">My Posts</h1> */}
      {/* Error message display removed, PostGridComponent handles empty/error states by showing "No posts found" */}
      <PostGridComponent posts={posts} />
    </div>
  );
}