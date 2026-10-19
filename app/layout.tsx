import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { EventoryProvider } from "../context/EventoryContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eventory | Plan • Book • Experience",
  description: "A one-stop platform for everything events by Eventory Nexus Limited. Discover events, book verified Nigerian vendors, and manage workspaces seamlessly.",
  keywords: ["tix africa", "event planning Nigeria", "Abuja event ticketing", "Lagos events", "vendor booking", "QR check-in", "Eventory Nexus"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-[#8ec82d] selection:text-[#301d6e]">
        <EventoryProvider>
          {children}
        </EventoryProvider>
      </body>
    </html>
  );
}
