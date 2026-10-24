import { randomBytes } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";
import { readLocalSupabase } from "./tests/local-supabase";

// BASE_URL có giá trị (vd link Vercel) → test chạy vào đó. Không có → tự build + start app ở máy, trỏ Supabase local.
const remoteBaseUrl = process.env.BASE_URL;
const localPort = 3100;

if (process.argv.some((arg) => arg.startsWith("--base-url"))) {
  throw new Error(
    "Playwright không có cờ --base-url. Dùng biến môi trường: BASE_URL=<link> npm run test:smoke",
  );
}

// Chỉ cần Supabase local khi tự chạy app ở máy; không có thì bỏ webServer và báo, không làm hỏng việc nạp config.
function localServerEnv(): Record<string, string> | undefined {
  let sb;
  try {
    sb = readLocalSupabase();
  } catch (error) {
    console.warn(
      `[playwright] ${error instanceof Error ? error.message : error} — không tự chạy app.`,
    );
    return undefined;
  }
  return {
    SUPABASE_URL: sb.apiUrl,
    SUPABASE_SERVICE_ROLE_KEY: sb.serviceRoleKey,
    IP_HASH_SECRET: randomBytes(32).toString("base64url"),
    APP_URL: `http://127.0.0.1:${localPort}`,
  };
}

function webServerConfig() {
  if (remoteBaseUrl) return undefined;
  const env = localServerEnv();
  if (!env) return undefined;
  return {
    command: `npm run build && npx next start -p ${localPort}`,
    url: `http://127.0.0.1:${localPort}/api/health`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env,
  };
}

export default defineConfig({
  testDir: "tests",
  testMatch: ["smoke/**/*.spec.ts", "e2e/**/*.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: remoteBaseUrl ?? `http://127.0.0.1:${localPort}`,
    trace: "retain-on-failure",
  },
  projects: [
    // Smoke chỉ gọi HTTP, không cần tải trình duyệt.
    { name: "smoke", testMatch: "smoke/**/*.spec.ts" },
    // E2E giao diện (từ slice 02b): 360px và 390px, giả lập Android.
    {
      name: "mobile-360",
      testMatch: "e2e/**/*.spec.ts",
      use: { ...devices["Pixel 5"], viewport: { width: 360, height: 780 } },
    },
    {
      name: "mobile-390",
      testMatch: "e2e/**/*.spec.ts",
      use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: webServerConfig(),
});
