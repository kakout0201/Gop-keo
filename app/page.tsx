// Trang chủ tạm của slice 00. Nút "Tạo kèo" mở được khi có trang /tao (slice 02b).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col justify-center gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-display font-extrabold">Góp Kèo</h1>
        <p className="text-body">
          Rủ cả nhóm đi chơi: vote ngày và chỗ, ghi chi tiêu, trả tiền bằng mã QR. Không cần đăng
          ký, chỉ cần gửi link vào Zalo.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-[18px] font-extrabold text-on-primary opacity-60"
        >
          Tạo kèo
        </button>
        <p className="text-center text-caption text-text-muted">Sắp có. App đang được xây dựng.</p>
      </div>
    </main>
  );
}
