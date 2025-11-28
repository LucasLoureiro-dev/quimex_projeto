"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// import { useAuth } from "../contexts/auth-context"
import { Sidebar } from "../../components/sidebar/sidebar"
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  // const { user, isLoading } = useAuth()
  const [user, setUser] = useState([])
  const nomeCaminho = usePathname()

  const mostrarSidebar = nomeCaminho !== '/pdv'

  const busca_usuario = async () => {
    const busca = await fetch("http://localhost:8080/dashboard", {
      credentials: "include"
    })

    const res = await busca.json()
    console.log(res)
    // setUser(res)
  }

  useEffect(() => {
    busca_usuario()
  }, [])

  console.log(user)

  return (
    <div className="min-h-screen bg-background">
          {mostrarSidebar && <Sidebar />}
          <main className={` ${mostrarSidebar === true ? "lg:pl-64" : "lg"}`}>
            <div className="p-4 lg:p-8 pt-16 lg:pt-8">
              {children}
            </div>
          </main>
        </div>
  )

  // {
  //   user.id ? (
  //     <>
        
  //     </>
  //   ) : (
  //     <>
  //       <div className="min-h-screen flex items-center justify-center bg-background">
  //         <div className="text-foreground">Carregando...</div>
  //       </div>
  //     </>
  //   )
  // }


}
