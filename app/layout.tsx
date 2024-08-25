import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home / X Clone",
  description: "An X Clone built with Next.js",
  icons: {
    icon: "icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
