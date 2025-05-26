"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

interface CreatePostFormProps {
  onFormSubmit: (values: PostFormValues) => Promise<void>;
  isSubmitting: boolean;
  formApiError: string | null;
}

export function CreatePostForm({
  onFormSubmit,
  isSubmitting,
  formApiError,
}: CreatePostFormProps) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
    },
    mode: "onChange",
  });

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/gi, "") // remove all non-word characters except spaces and hyphens
        .replace(/\s+/g, "-");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  return (
    <>
      {formApiError && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {formApiError}
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter post title"
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      generateSlug();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input placeholder="post-slug" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                    className="ml-2"
                  >
                    Generate
                  </Button>
                </div>
                <FormDescription>
                  Used for URL: /posts/your-slug
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Short description of the post"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your post content here..."
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use line breaks to separate paragraphs.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
