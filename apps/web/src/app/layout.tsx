import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import { Toast } from "@/components/ui/common";
import "./globals.css";
import "./kingdom.css";
const sans = Geist({ variable: "--font-body", subsets: ["latin"] });
const serif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
export const metadata: Metadata = {
  title: {
    default: "MealTale — The Enchanted Kitchen",
    template: "%s | MealTale",
  },
  description:
    "Your enchanted kitchen awaits. Keep ingredients fresh, discover recipes, plan royal feasts, and give everyday cooking a little magic.",
  icons: { icon: "/branding/crest.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        {children}
        <Toast />
      </body>
    </html>
  );
}
