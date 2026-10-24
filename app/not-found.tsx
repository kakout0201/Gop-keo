import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col justify-center gap-4 px-4 py-8">
      <h1 className="text-title font-extrabold">Không tìm thấy trang này</h1>
      <p className="text-body text-text-muted">Kiểm tra lại link trong Zalo nhé.</p>
      <Link
        href="/"
        className="flex h-12 items-center justify-center rounded-full border-[1.5px] border-border-strong bg-surface font-bold"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
