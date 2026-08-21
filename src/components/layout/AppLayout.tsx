import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { AuthGate } from "./AuthGate";

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  children: ReactNode;
}) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header title={title} subtitle={subtitle} />
        <div className="lg:pl-[260px]">
          <MobileNav />
          <main className="px-5 pb-12 pt-24 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
