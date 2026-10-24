import { execSync } from "node:child_process";

// Đọc URL và khóa của Supabase LOCAL (khóa demo mặc định của CLI, không phải bí mật của project cloud).
// Không bao giờ in giá trị ra log.
export type LocalSupabase = {
  apiUrl: string;
  dbUrl: string;
  anonKey: string;
  serviceRoleKey: string;
};

export function readLocalSupabase(): LocalSupabase {
  let raw: string;
  try {
    raw = execSync("npx supabase status -o json", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    throw new Error("Supabase local chưa chạy. Bật Docker Desktop rồi chạy: npx supabase start");
  }
  const status = JSON.parse(raw) as Record<string, string | undefined>;
  const apiUrl = status.API_URL;
  const dbUrl = status.DB_URL;
  const anonKey = status.ANON_KEY;
  const serviceRoleKey = status.SERVICE_ROLE_KEY;
  if (!apiUrl || !dbUrl || !anonKey || !serviceRoleKey) {
    throw new Error(
      "`supabase status` thiếu API_URL, DB_URL hoặc khóa (cần [auth] enabled trong config.toml)",
    );
  }
  return { apiUrl, dbUrl, anonKey, serviceRoleKey };
}
