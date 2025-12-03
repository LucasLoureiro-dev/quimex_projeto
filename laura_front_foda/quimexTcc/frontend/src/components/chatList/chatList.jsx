"use client"
import { useState } from "react"

import Link from "next/link"
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


const histChat = [
    {
      "nome_usuario": "Alice",
      "horario": "14:30",
      "mensagem": "Oi! Você viu o novo relatório?",
      "lido": true
    },
    {
      "nome_usuario": "Bruno",
      "horario": "14:32",
      "mensagem": "Sim, acabei de ler. Ficou muito bom.",
      "lido": true
    },
    {
      "nome_usuario": "Alice",
      "horario": "14:33",
      "mensagem": "Que bom! Vamos apresentar amanhã?",
      "lido": true
    },
    {
      "nome_usuario": "Carlos",
      "horario": "14:35",
      "mensagem": "Eu posso ajudar na apresentação.",
      "lido": true
    },
    {
      "nome_usuario": "Diana",
      "horario": "14:40",
      "mensagem": "Alguém tem o link da reunião?",
      "lido": false
    },
    {
      "nome_usuario": "Bruno",
      "horario": "14:42",
      "mensagem": "Vou enviar no grupo agora.",
      "lido": false
    }
  ]

export function ChatList(){

    const [open, setOpen] = useState(false)

    const SidebarContent = () => (
        <>
        <div className="flex h-full flex-col bg-sidebar m-3 border-rounded">
            <div className="border-b border-sidebar-border p-6">
                <p>barra pesquisa</p>
            </div>
           <p>lista do chat</p> 
           <ScrollArea className="flex-1 px-3 py-4">
           <nav className="space-y-1">
           {histChat.map((item, index) => {
          return(
          <li key={index} className={`flex flex-col items-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors`}>
            <p>{item.nome_usuario}</p>
            <p className="flex flex-wrap h-3 text-muted-foreground text-small">{item.mensagem}</p>
          </li>
        )})
      }
            </nav>
           </ScrollArea>
        </div>
        </>
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