"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { LayoutDashboard, Store, Users, Package, Truck, ShoppingCart, DollarSign, PackageOpen, Menu, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "../../app/contexts/theme-context"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard"},
  { icon: Store, label: "Lojas", href: "/lojas"},
  { icon: Users, label: "Funcionários", href: "/funcionarios"},
  { icon: PackageOpen, label: "Estoque", href: "/estoque"},
  { icon: Package, label: "Produtos", href: "/produtos"},
  { icon: Truck, label: "Fornecedores", href: "/fornecedores"},
  { icon: ShoppingCart, label: "PDV", href: "/pdv"},
  { icon: DollarSign, label: "Financeiro", href: "/financeiro"},
]

export function Sidebar() {
  const pathname = usePathname()
  const [ user, setUser ] = useState([])
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const busca_usuario = async () => {
    const busca = await fetch("http://localhost:8080/dashboard", {
      credentials: "include"
    })

    const res = await busca.json()
    console.log(res)
    return res;
  }

  useEffect(() => {
    const usuario = busca_usuario()

    setUser(usuario)
  }, [])

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar">
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
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
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
