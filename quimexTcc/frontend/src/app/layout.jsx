import { Geist } from "next/font/google";
import { ThemeProvider } from "./contexts/theme-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { AuthProvider } from "@/app/contexts/auth-context";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight:'400'
});

export const metadata = {
  title: "Quimex",
  description: "Criado para eficiência e qualidade",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${geist.variable}`}>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
