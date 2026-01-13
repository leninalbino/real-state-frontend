import type { ReactNode } from "react";
import { Header } from "../../shared/layout/Header";
import { Footer } from "../../shared/layout/Footer";

export const AppLayout = ({
  children,
  headerCenterContent,
  hideNav = false,
}: {
  children: ReactNode;
  headerCenterContent?: ReactNode;
  hideNav?: boolean;
}) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header centerContent={headerCenterContent} showNav={!hideNav} />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);
