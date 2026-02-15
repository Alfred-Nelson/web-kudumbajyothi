import type { Metadata } from "next";
import { Anek_Malayalam, Chilanka } from "next/font/google";
import "./globals.css";
import Header from "./header";

const anek_malayalam = Anek_Malayalam({
  variable: "--font-anek-mal",
  subsets: ["malayalam"],
  display: "swap"
})

const chilanka = Chilanka({
  variable: "--font-chilanka",
  subsets: ["malayalam"],
  weight: ["400"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "Kudumbajyoti",
  description: "the nasrani family magazine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml">
      <body
        className={`${anek_malayalam.variable} ${chilanka.variable} font-family-anek-mal making some changes here text-justify antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
