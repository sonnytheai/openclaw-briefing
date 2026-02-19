import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Briefing Dashboard",
  description: "AI-powered news briefing system built on OpenClaw",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="border-b border-[var(--border)] bg-[var(--bg)] py-2 px-4 flex justify-between items-center text-xs">
          <a href="/" className="font-bold tracking-wider text-[var(--accent-primary)] hover:text-[var(--text-bright)] uppercase">
            Briefing <span className="text-[var(--text-muted)] font-normal">Dashboard</span>
          </a>
          <div className="text-[var(--text-muted)] tracking-wide font-mono">
            {new Date().toISOString().split("T")[0]}
          </div>
        </header>
        <main className="max-w-4xl w-full mx-auto px-4 py-4 flex-grow">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-2 text-[10px] uppercase tracking-widest text-[var(--text-muted)] text-center">
          OpenClaw Briefing System
        </footer>
      </body>
    </html>
  );
}
