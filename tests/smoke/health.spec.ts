import { expect, test } from "@playwright/test";

test.describe("@smoke", () => {
  test("/api/health trả ok và DB kết nối được", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("no-store");
    const body = await res.json();
    expect(body).toMatchObject({ ok: true, db: "ok" });
    expect(typeof body.version).toBe("string");
  });

  test("trang chủ có tên app, tiếng Việt và header bảo mật", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('lang="vi"');
    expect(html).toContain("Góp Kèo");
    const headers = res.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("link sai trả trang 404 tiếng Việt", async ({ request }) => {
    const res = await request.get("/khong-co-trang-nay");
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain("Không tìm thấy kèo này");
  });
});
