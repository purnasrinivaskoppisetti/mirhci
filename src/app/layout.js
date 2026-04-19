import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mirchi Mart",
  description: "Chilli Purchase Management",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="bg-gray-100 flex justify-center">

        <div className="w-full max-w-md min-h-screen bg-gray-100 relative">

          <Header />

          {/* CONTENT */}
          <div className="pb-20">
            {children}
          </div>

          <Footer />

        </div>

      </body>
    </html>
  );
}