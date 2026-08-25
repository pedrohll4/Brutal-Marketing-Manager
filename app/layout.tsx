import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { SystemStoreProvider } from "@/lib/context/SystemStoreContext";
import { ToastContainer } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";

export const viewport: Viewport = {
  themeColor: "#FF5500",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Brutal Marketing Manager | Marketing Control",
  description: "Sistema completo de gerenciamento de clientes, produção audiovisual, campanhas, calendário e financeiro da Brutal Marketing.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Brutal Manager",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Brutal Manager" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-[#131313] text-[#e5e2e1] min-h-screen antialiased">
        <AuthProvider>
          <SystemStoreProvider>
            {children}
            <CommandPalette />
            <ToastContainer />
            <PWAInstallPrompt />
          </SystemStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
