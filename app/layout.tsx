import type { Metadata } from "next";
import { Outfit, Rubik_Mono_One } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const rubikMonoOne = Rubik_Mono_One({
  variable: "--font-rubik-mono-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Drummer - Learn Drums Like a Rockstar",
  description: "Rock out and learn drums one beat at a time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${rubikMonoOne.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
