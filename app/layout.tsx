import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "شام كاش",
  description:
    "الحل الأمثل لإدارة معاملاتك المالية بسهولة وأمان يتيح لك إرسال واستلام الأموال بسرعة وسلاسة، مع واجهة استخدام بسيطة وتجربة مريحة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
