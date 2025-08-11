import { z } from "zod";

// Esquemas de autenticación
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Esquemas de usuario
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name too long")
    .optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().cuid("Invalid user ID"),
});

// Esquemas de posts
export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().max(5000, "Content too long").optional(),
});

export const postQuerySchema = z.object({
  authorId: z.string().cuid("Invalid author ID").optional(),
});

// Esquemas de paginación
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Tipos TypeScript derivados de los esquemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

