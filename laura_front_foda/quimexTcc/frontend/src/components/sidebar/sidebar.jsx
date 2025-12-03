"use client"
 
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  Truck,
  ShoppingCart,
  DollarSign,
  PackageOpen,
  Menu,
  LogOut,
  Moon,
  Sun
} from "lucide-react"
 
import { useAuth } from "../../app/contexts/auth-context"
import { useTheme } from "../../app/contexts/theme-context"

const roleRedirects = {
  administrador: 'admin/dashboard',
  gerente: 'gerente/dashboard',
  vendedor: 'vendedor/dashboard',
};
 
const menuItems = [
  //admin
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['administrador'] 
  },
  {
    label: 'Lojas',
    path: '/admin/lojas',
    icon: Store,
    allowedRoles: ['administrador'] 
  },
  {
    label: 'Funcionários',
    path: '/admin/funcionarios',
    icon: Users,
    allowedRoles: ['administrador'] 
  },
  {
    label: 'Fornecedores',
    path: '/admin/fornecedores',
    icon: Truck,
    allowedRoles: ['administrador'] 
  },
  {
    label: 'Produtos',
    path: '/admin/produtos',
    icon: Package,
    allowedRoles: ['administrador'] 
  },
  {
    label: 'Financeiro',
    path: '/admin/financeiro',
    icon: DollarSign,
    allowedRoles: ['administrador'] 
  },
  //gerente
  {
    label: 'Dashboard',
    path: '/gerente/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['gerente'] 
  },
  {
    label: 'Loja',
    path: '/gerente/loja',
    icon: Store,
    allowedRoles: ['gerente'] 
  },
  {
    label: 'Funcionários',
    path: '/gerente/funcionarios',
    icon: Users,
    allowedRoles: ['gerente'] 
  },
  {
    label: 'Fornecedores',
    path: '/gerente/fornecedores',
    icon: Truck,
    allowedRoles: ['gerente'] 
  },
  {
    label: 'Produtos',
    path: '/gerente/produtos',
    icon: Package,
    allowedRoles: ['gerente'] 
  },
  {
    label: 'Financeiro',
    path: '/gerente/financeiro',
    icon: DollarSign,
    allowedRoles: ['gerente'] 
  },
  //vendedor
  {
    label: 'Dashboard',
    path: '/vendedor/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['funcionario'] 
  },
  {
    label: 'PDV',
    path: '/vendedor/pdv',
    icon: ShoppingCart,
    allowedRoles: ['funcionario'] 
  }
];

// const menuItems = [
//   { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
//   { icon: Store, label: "Lojas", href: "/lojas" },
//   { icon: Users, label: "Funcionários", href: "/funcionarios" },
//   { icon: Package, label: "Produtos", href: "/produtos" },
//   { icon: Truck, label: "Fornecedores", href: "/fornecedores" },
//   { icon: DollarSign, label: "Financeiro", href: "/financeiro" }
// ]

const gerenteItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Store, label: "Loja", href: "/loja" },
  { icon: Users, label: "Funcionários", href: "/funcionarios" },
  { icon: Package, label: "Produtos", href: "/produtos" },
  { icon: Truck, label: "Fornecedores", href: "/fornecedores" },
  { icon: DollarSign, label: "Financeiro", href: "/financeiro" }
]
 
const vendedorItems = [
  { icon: ShoppingCart, label: "PDV", href: "/pdv" }
]
 
// ===============================
// SIDEBAR
// ===============================
export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
 
  const getUserRole = () => {
    if (!user) return null
    const role = user.perfil || user.role || user.cargo
    return role ? String(role).toLowerCase() : null
  }
 
  const role = getUserRole()
  console.log(role)

  let finalMenu = []
 
  if (role === "administrador") {
    finalMenu = menuItems
  } else if (role === "gerente") {
    finalMenu = gerenteItems
  }
  else if (role === "vendedor") {
    finalMenu = menuItems
  } else {
    finalMenu = []
  }
 
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar">
 
      {/* Header */}
      <div className="border-b border-sidebar-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-sidebar-foreground">Quimex</h3>
            <p className="text-sm text-sidebar-foreground/70 mt-1">{user?.nome}</p>
          </div>
 
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {theme === "dark"
              ? <Sun className="h-5 w-5" />
              : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
 
      {/* Links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems
        .filter(item => item.allowedRoles.includes(role))
        .map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return(
          <li key={index} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground": "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
            <Icon className="h-5 w-5" />
            <Link href={item.path}>
              {item.label}
            </Link>
          </li>
        )})
      }
        </nav>
      </ScrollArea>
 
      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
 
    </div>
  )
 
  return (
    <>
      {/* Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
 
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
 
      {/* Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}
 
 