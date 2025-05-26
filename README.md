# DISCLAIMER

**Important Note about MockAPI:** Because the free account for MockAPI does not support creating endpoints, the MockAPI used in this project has certain limitations. Specifically, it does not support `POST` requests for `/login` and `/signup` routes. Additionally, there is no slug-based endpoint available for fetching individual posts (e.g., `/posts/:slug`). All post data is fetched from the `/posts` endpoint.

## Addressed Feedback

Based on the concise and insightful feedback from the development team, the following areas for improvement have been addressed:

*   **Duplicate User Registration:**
    *   The system permits multiple users to register with the same email and username, leading to potential data integrity issues.
    *   **Fix:** Modification of the `signUpUser` server action by replacing faulty email and username check with working code.

*   **Inconsistent Form Validation:**
    *   The validation rules for the sign-up and login forms are inconsistent, potentially causing user confusion.
    *   **Fix:** Zod validation schema is now shared between the sign-up and login forms, with the sign-up schema extending the login schema.

*   **Limited Content Visibility:**
    *   Currently, users can only view their own posts, which contradicts common expectations for a blogging platform where content is typically shared and discoverable by others.
    *   **Fix:** New `getAllPosts` server action introduced consuming the `/posts/` endpoint to retrieve all posts for a user to view. The `/posts` page has been overhauled to accommodate two different views: "All posts" and "My posts". A search by post title feature has also been added for each view.

*   **Absence of Error Handling Mechanisms:**
    *   The application lacks comprehensive error handling for network requests and form submissions, which may lead to uninformative user feedback during failures.
    *   **Fix:** Validation messages, toasters, and helpful error messages returned by server actions now facilitate comprehensive error handling.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## MockAPI BASE_URL
https://6830ac896205ab0d6c3a0441.mockapi.io/api/v1/

## Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd SeenaPayTask
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## CRUD Operations

This project implements or supports the following CRUD (Create, Read, Update, Delete) operations, primarily for **Posts**:

*   **Create Posts:**
    *   Although not explicitly shown in the current file structure as a dedicated page (e.g., `/posts/create`), the system is designed to allow for the creation of new posts. This would typically involve a form and an API call to a `POST` endpoint (e.g., `/api/posts` or directly to the MockAPI `/posts` endpoint if supported for creation).
    *   The `src/lib/api/post.ts` file would likely contain a `createPost` function.

*   **Read Posts:**
    *   **Read All Posts:** Users can view a list of all posts, typically fetched from the `/posts` endpoint. This is handled by `src/app/(authorized)/posts/page.tsx`.
    *   **Read Single Post:** Users can view the details of an individual post. This is handled by `src/app/(authorized)/posts/[id]/page.tsx`, using a function like `getPostById` from `src/lib/api/post.ts`.

*   **Update Posts:**
    *   Users can edit existing posts. This functionality is implemented in `src/app/(authorized)/posts/[id]/edit/page.tsx`.
    *   It uses an `updatePost` function (likely in `src/lib/api/post.ts`) to send `PUT` or `PATCH` requests to the API (e.g., `/api/posts/:id` or MockAPI `/posts/:id`).

*   **Delete Posts:**
    *   The capability to delete posts can be implemented. This would typically involve a `deletePost` function in `src/lib/api/post.ts` making a `DELETE` request to an API endpoint (e.g., `/api/posts/:id` or MockAPI `/posts/:id`).
    *   UI elements for deletion could be added to the post list or post detail pages.

These operations interact with the backend API (MockAPI in this case, with its noted limitations) via functions defined in `src/lib/api.ts` or more specifically `src/lib/api/post.ts`.

## File Structure

Here's an overview of the key directories and files in this project:

```
SeenaPayTask/
├── src/
│   ├── app/                      # Main application directory (App Router)
│   │   ├── (auth)/               # Route group for authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (authorized)/         # Route group for main application pages (e.g., after login)
│   │   │   ├── layout.tsx
│   │   │   ├── posts/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx  # Page for editing an individual post
│   │   │   │   │   └── page.tsx      # Dynamic route for individual post details
│   │   │   │   └── page.tsx          # Page for listing all posts
│   │   │   └── page.tsx              # Home page after login (redirects to /posts)
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Entry page (redirects to /login or /posts)
│   ├── components/               # Reusable UI components
│   │   ├── auth/                 # Authentication related components
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── common/               # Common shared components (e.g., Navbar, Footer)
│   │   │   └── Navbar.tsx
│   │   └── posts/                # Post related components
│   │       ├── PostCard.tsx
│   │       └── PostDetail.tsx
│   ├── hooks/                    # Custom React hooks
│   │   └── useAuth.ts            # Hook for authentication state and logic
│   ├── lib/                      # Utility functions, API clients, etc.
│   │   ├── api.ts                # API service functions for MockAPI
│   │   └── utils.ts              # General utility functions
│   ├── store/                    # State management (e.g., Zustand, Redux)
│   │   └── authStore.ts          # Zustand store for authentication
├── public/                   # Static assets (images, fonts, etc.)
├── .env.local.example        # Example environment variables file
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore file
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── README.md                 # This file
└── tsconfig.json             # TypeScript configuration
```
