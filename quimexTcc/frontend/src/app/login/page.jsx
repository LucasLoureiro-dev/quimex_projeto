"use client"
 
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, ChevronDown } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import Link from "next/link"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup
} from "@/components/ui/select";
 
export default function LoginPage() {
  const router = useRouter()
  const [RE, setRE] = useState("")
  const [password, setPassword] = useState("")
  const [profile, setProfile] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
 
  useEffect(() => {
    setMounted(true)
  }, [])
 
  if (!mounted) return <div className="min-h-screen bg-[#20532A]" />
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
 
    const res = await fetch(`http://localhost:8080/login`, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Sending JSON data
      },
      body: JSON.stringify({
        RE: RE,
        senha: password,
        cargo: profile
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      if (res.status == 401) {
        setError("Usuário/Senha errados");
        setLoading(false);
      }
      if (res.status == 404) {
        setError("Usuário não encontrado");
        setLoading(false);
      }
    }
    else{
      setLoading(false);
   
    }

    const data = await res.json();

    if (data.cargo == "Administrador") {
      window.location.href = "admin/dashboard";
    } else if (data.cargo == "Gerente") {
      window.location.href = "gerente/dashboard";
    } else if (data.cargo == "Funcionario") {
      window.location.href = "vendedor/pdv";
    }
   
  }
 
  const loginCardClasses = `
    w-full max-w-md relative z-20
    rounded-[2rem] p-8 md:p-10
    backdrop-blur-xl shadow-2xl border transition-all duration-300
    bg-[#DCE7DE] border-white/60 shadow-xl
  `
 
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col md:flex-row font-sans bg-[#20532A]">
 
      {/* ONDA */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="h-full w-full transition-all duration-700 ease-in-out"
          viewBox="0 0 320 1440"
          preserveAspectRatio="none"
        >
          <path
            className="fill-white"
            d="
              M160,0
              C135,200 135,380 160,560
              C185,740 185,920 160,1100
              C150,1200 130,1240 160,1440
              L0,1440 L0,0 Z
            "
          />
        </svg>
      </div>
 
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <span className="text-xl font-bold flex items-center text-[#20532A]">
          <img
            src="/logo/logo-verde.svg"
            alt="Logo Quimex verde"
            className="h-15 w-14 mr-2 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
          Quimex
        </span>
      </div>
 
      <div className="relative z-10 w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
 
        {/* LADO ESQUERDO */}
        <div className="hidden md:flex flex-col items-center justify-center h-full p-12">
 
          <div className="mt-8 text-center max-w-sm text-[#20532A]">
            <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
            <p className="text-[#20532A] opacity-100">
              Gerencie seu empreendimento químico com precisão e segurança.
            </p>
          </div>
 
 
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full opacity-20 blur-2xl transform scale-110"></div>
            <DotLottieReact
              src="https://lottie.host/0d3d862e-4a85-45c2-9f23-6450adac7bc4/sBt2mMrPlB.lottie"
              loop
              autoplay
            />
          </div>
        </div>
 
        {/* LOGIN CARD */}
        <div className="flex flex-col justify-center items-center p-6 md:p-16 h-full w-full">
          <div className={loginCardClasses}>
            <h2 className="text-4xl font-bold mb-2 text-center text-[#20532A]">
              Login
            </h2>
            <p className="text-sm mb-8 text-center text-[#0F703A]">
              Acesse a plataforma Quimex
            </p>
 
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div className="space-y-2">
                <label
                  htmlFor="RE"
                  className="text-sm font-medium ml-1 text-[#1B8742]"
                >
                  RE
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#279D49]" />
                  <input
                    id="RE"
                    type="text"
                    placeholder="xxxxxx"
                    value={RE}
                    onChange={(e) => setRE(e.target.value)}
                    required
                    className="pl-10 h-12 w-full rounded-lg border transition-all outline-none
                    bg-white border-[#BEE2B9] text-[#20532A] placeholder-[#20532A]/40
                    focus:ring-1 focus:ring-[#279D49]"
                  />
                </div>
              </div>
 
              {/* SENHA */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium ml-1 text-[#1B8742]"
                  autoComplete="off"
                >
                  Senha
                </label>
 
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#279D49]" />
 
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 w-full rounded-lg border transition-all outline-none
                    bg-white border-[#BEE2B9] text-[#20532A] placeholder-[#20532A]/40
                    focus:ring-1 focus:ring-[#279D49]"
                  />
                </div>
              </div>
 
              {/* PERFIL */}
              <div className="space-y-2">
                <Label className="text-[#279D49]">Escolha o perfil</Label>
                <Select value={profile} onValueChange={setProfile} className="bg-white">
                  <SelectTrigger className="text-primary bg-white h-12">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectGroup>
                    <SelectContent>
                    <SelectLabel>Perfil</SelectLabel>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                  </SelectContent>
                  </SelectGroup>
                </Select>
              </div>
 
              {/* ERRO */}
              {error && (
                <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-700 text-sm">
                  {error}
                </div>
              )}
 
              {/* BOTÃO */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold h-12 rounded-lg shadow-lg transition-all mt-6
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5 hover:shadow-xl"}
                bg-[#2EAF4A] hover:bg-[#1B8742] text-white shadow-[#2EAF4A]/30`}
              >
                {loading ? "Entrando..." : "Login"}
              </button>
              <Link href={'/areaDoVendedor'}>
              <button
                type="submit"
                className={`w-full font-semibold h-12 rounded-lg shadow-lg transition-all 
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5 hover:shadow-xl"}
                bg-[#2EAF4A] hover:bg-[#1B8742] text-white shadow-[#2EAF4A]/30`}
              >
                Login do vendedor
              </button>
              </Link>              
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
 
 