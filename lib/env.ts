import "server-only";
import { z } from "zod";

// Biến môi trường server-only (kiến trúc §4). Không có biến NEXT_PUBLIC_* chứa khóa.
const EnvSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  IP_HASH_SECRET: z.string().min(32),
  APP_URL: z.url(),
});

export type Env = z.infer<typeof EnvSchema>;

// Lỗi chỉ nêu tên biến, không bao giờ in giá trị.
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => String(issue.path[0])))];
    throw new Error(`Thiếu hoặc sai biến môi trường: ${names.join(", ")}`);
  }
  return result.data;
}

let cached: Env | undefined;

export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
