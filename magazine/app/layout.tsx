import type { Metadata } from "next";
// import { Anek_Malayalam, Chilanka } from "next/font/google";
import "./globals.css";
import Header from "./header";
import localFont from 'next/font/local'
import APIS from "@/sanity/api";


const uroob = localFont({
  src: './fonts/Uroob/Uroob-Regular.woff2',
  preload: true,
  display: "block",
  variable: "--font-uroob"
})

const malini = localFont({
  src: './fonts/Malini/Malini-VF.woff2',
  preload: true,
  display: "block",
  variable: "--font-malini"
})

// const anek_malayalam = Anek_Malayalam({
//   variable: "--font-anek-mal",
//   subsets: ["malayalam"],
//   display: "swap"
// })

// const chilanka = Chilanka({
//   variable: "--font-chilanka",
//   subsets: ["malayalam"],
//   weight: ["400"],
//   display: "swap"
// })

export const metadata: Metadata = {
  title: "Kudumbajyoti",
  description: "the nasrani family magazine",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml" className={`${uroob.variable} ${malini.variable}`}>
      <body
        className={`antialiased max-w-screen overflow-x-hidden bg-orange-50/50`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
