import * as z from 'zod';

export const CreatePostSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(200, { message: "Title must not exceed 200 characters" })
    .trim(),

  description: z
    .string({ message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description must not exceed 500 characters" })
    .trim(),

  content: z
    .string({ message: "Content is required" })
    .min(50, { message: "Content must be at least 50 characters long" })
    .max(10000, { message: "Content must not exceed 10,000 characters" })
    .trim(),
});

export const UpdatePostSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(200, { message: "Title must not exceed 200 characters" })
    .trim()
    .optional(),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description must not exceed 500 characters" })
    .trim()
    .optional(),

  content: z
    .string()
    .min(50, { message: "Content must be at least 50 characters long" })
    .max(10000, { message: "Content must not exceed 10,000 characters" })
    .trim()
    .optional(),
}).refine(
  (data) => data.title || data.description || data.content,
  {
    message: "At least one field (title, description, or content) must be provided",
    path: ["title"], // Show error on title field
  }
);





// Type exports for use in components
export type CreatePostFormData = z.infer<typeof CreatePostSchema>;
export type UpdatePostFormData = z.infer<typeof UpdatePostSchema>;
