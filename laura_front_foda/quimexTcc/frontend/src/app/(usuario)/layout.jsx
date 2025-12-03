"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/sidebar/sidebar";
import { usePathname } from "next/navigation";
import Loading from "../loading";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const nomeCaminho = usePathname();

  const mostrarSidebar = nomeCaminho !== "/pdv";

  return (
    <div className="min-h-screen bg-background">
      {mostrarSidebar && <Sidebar />}
      <main className={` ${mostrarSidebar === true ? "lg:pl-64" : "lg"}`}>
        <div className={` ${mostrarSidebar === true ? "p-4 lg:p-8 pt-16 lg:pt-8" : "p-0"}`}>
          {children}
          </div>
      </main>
    </div>
  );
}
