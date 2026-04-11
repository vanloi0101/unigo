import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Register validation schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự"),
});
