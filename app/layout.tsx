import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drummer - Learn Drums",
  description: "A fun app for kids to learn beginner drum patterns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
