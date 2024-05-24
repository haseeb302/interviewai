import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview AI",
  description: "Prepare for your next job interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-900/90`}>
        <Providers>
          <nav className="flex flex-col justify-center items-center border-b">
            <h3 className="text-3xl font-extrabold p-2 my-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500">
              InterviewAI
            </h3>
            <span className="text-sm text-gray-600 font-bold">
              Limited Availability 3/day
            </span>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
