import { randomBytes } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";
import { readLocalSupabase } from "./tests/local-supabase";

// BASE_URL có giá trị (vd link Vercel) → test chạy vào đó. Không có → tự build + start app ở máy, trỏ Supabase local.
const remoteBaseUrl = process.env.BASE_URL;
const localPort = 3100;

function localServerEnv() {
  const sb = readLocalSupabase();
  return {
    SUPABASE_URL: sb.apiUrl,
    SUPABASE_SERVICE_ROLE_KEY: sb.serviceRoleKey,
    IP_HASH_SECRET: randomBytes(32).toString("base64url"),
    APP_URL: `http://127.0.0.1:${localPort}`,
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
  webServer: remoteBaseUrl
    ? undefined
    : {
        command: `npm run build && npx next start -p ${localPort}`,
        url: `http://127.0.0.1:${localPort}/api/health`,
        timeout: 240_000,
        reuseExistingServer: !process.env.CI,
        env: localServerEnv(),
      },
});
