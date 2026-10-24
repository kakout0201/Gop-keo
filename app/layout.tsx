import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Góp Kèo",
  description: "Lên kèo đi chơi và chia tiền bằng VietQR cho nhóm bạn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
