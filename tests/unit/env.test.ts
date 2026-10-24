import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

const valid = {
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_SERVICE_ROLE_KEY: "x".repeat(40),
  IP_HASH_SECRET: "y".repeat(43),
  APP_URL: "https://gopkeo.vercel.app",
};

describe("parseEnv", () => {
  it("nhận đủ 4 biến hợp lệ", () => {
    expect(parseEnv(valid)).toEqual(valid);
  });

  it("báo tên biến thiếu hoặc sai, không in giá trị", () => {
    const secret = "bi-mat-khong-duoc-in-ra";
    const run = () =>
      parseEnv({
        ...valid,
        SUPABASE_URL: "khong-phai-url",
        IP_HASH_SECRET: secret,
        APP_URL: undefined,
      });
    expect(run).toThrow(/SUPABASE_URL/);
    expect(run).toThrow(/IP_HASH_SECRET/);
    expect(run).toThrow(/APP_URL/);
    expect(run).not.toThrow(new RegExp(secret));
  });

  it("bỏ qua biến lạ, chỉ trả 4 biến cần dùng", () => {
    expect(Object.keys(parseEnv({ ...valid, NEXT_PUBLIC_X: "1" })).sort()).toEqual(
      Object.keys(valid).sort(),
    );
  });
});
