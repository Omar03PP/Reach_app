import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REACH",
  description: "Marketplace para clientes y freelancers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
