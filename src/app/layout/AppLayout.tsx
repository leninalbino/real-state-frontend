import type { ReactNode } from "react";
import { Header } from "../../shared/layout/Header";
import { Footer } from "../../shared/layout/Footer";

export const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);
