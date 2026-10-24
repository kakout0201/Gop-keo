import { connection } from "next/server";
import { db } from "@/lib/db/client";
import { appVersion } from "@/lib/version";

const noStore = { "Cache-Control": "no-store" };

// 04-contracts §5: không cần cookie, không trả dữ liệu người dùng.
export async function GET() {
  await connection();
  try {
    const { error } = await db().from("trips").select("id", { head: true }).limit(1);
    if (error) throw error;
    return Response.json({ ok: true, version: appVersion(), db: "ok" }, { headers: noStore });
  } catch (error) {
    // Chỉ log mã lỗi, không log thông điệp (có thể chứa URL hay chi tiết kết nối).
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : error instanceof Error
          ? error.name
          : "unknown";
    console.error("health: db error", code);
    return Response.json({ ok: false, db: "error" }, { status: 503, headers: noStore });
  }
}
