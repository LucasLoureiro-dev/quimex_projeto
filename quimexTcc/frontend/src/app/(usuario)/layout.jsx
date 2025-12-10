"use client";

import { usePathname } from "next/navigation";
import { Sidebar, menuItems } from "../../components/sidebar/sidebar"; // Importe o menuItems
import { useAuth } from "../../app/contexts/auth-context";
import Loading from "../loading"; 

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, loading } = useAuth(); 

  const rotasVendedor = [
    {
      rotaLogin: "/vendedor/loginVendedor",
      areaVendedor: "/areaDoVendedor",
      pdv: "/vendedor/pdv",
    }
  ]

  const rotasSemSidebar = Object.values(rotasVendedor[0]);
 
  const getUserRole = () => {
    if (!user) return null;
    const role = user.perfil || user.role || user.cargo;
    return role ? String(role).toLowerCase() : null;
  };

  const role = getUserRole();

  const userHasSidebarAccess = menuItems.some(item => 
    item.allowedRoles.includes(role)
  );

  const isFullScreenPage = rotasSemSidebar.some(rota => pathname.includes(rota));
  const showSidebar = userHasSidebarAccess && !isFullScreenPage;

  if (loading) {
     return <div className="h-screen flex items-center justify-center"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <Sidebar />}
      <main 
        className={`transition-all duration-300 ${
          showSidebar ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        <div className={` ${
            showSidebar ? "p-4 lg:p-8 pt-16 lg:pt-8" : "p-0"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}