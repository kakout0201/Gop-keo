// Mã phiên bản hiển thị ở /api/health: 7 ký tự đầu của commit trên Vercel, "dev" khi chạy ở máy.
export function appVersion(): string {
  return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";
}
