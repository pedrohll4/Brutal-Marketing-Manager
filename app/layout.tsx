import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { SystemStoreProvider } from "@/lib/context/SystemStoreContext";
import { ToastContainer } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/layout/CommandPalette";

export const metadata: Metadata = {
  title: "Brutal Marketing Manager | Marketing Control",
  description: "Sistema completo de gerenciamento de clientes, produção audiovisual, campanhas, calendário e financeiro da Brutal Marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#131313] text-[#e5e2e1] min-h-screen antialiased">
        <AuthProvider>
          <SystemStoreProvider>
            {children}
            <CommandPalette />
            <ToastContainer />
          </SystemStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
