"use client"
 
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import { useAuth } from "@/app/contexts/auth-context"
import { User, Lock, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
 
export default function LoginPage() {
  const router = useRouter()
  // const { login } = useAuth()
 
  const [theme, setTheme] = useState("dark")
  const [re, setre] = useState("")
  const [password, setPassword] = useState("")
  const [profile, setProfile] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
 
  // Carrega tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }, [])
 
  // Alterna tema claro/escuro
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }
 
  // Envio do formulário
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
        RE: re,
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
      window.location.href = "/dashboard";
    } else if (data.cargo == "Gerente") {
      window.location.href = "/dashboard";
    } else if (data.cargo == "Vendedor") {
      window.location.href = "/pdv";
    }
  }
 
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0e1a]" : "bg-slate-50"
        }`}
    >
      {/* Botão de alternância de tema */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full border transition-all duration-300 backdrop-blur-sm ${theme === "dark"
            ? "bg-slate-800/30 border-slate-700/30 hover:bg-slate-700/40"
            : "bg-white/80 border-slate-200 hover:bg-slate-100"
          }`}
        aria-label="Alternar tema"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-slate-300" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </button>
 
      {/* Cartão de Login */}
      <div className="w-full max-w-md">
        <div
          className={`rounded-2xl p-8 md:p-10 backdrop-blur-xl shadow-2xl border ${theme === "dark"
              ? "bg-slate-900/20 border-slate-800/30"
              : "bg-white border-slate-200"
            }`}
        >
          {/* Logo e título */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
              <svg
                className="w-9 h-9 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h1
              className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Quimex
            </h1>
            <p
              className={`text-sm text-center ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
            >
              Sistema de Gestão de Produtos Químicos
            </p>
          </div>
 
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo re */}
            <div className="space-y-2">
              <Label
                htmlFor="re"
                className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                re
              </Label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}
                />
                <Input
                  id="re"
                  type="re"
                  placeholder="seu@re.com"
                  value={re}
                  onChange={(e) => setre(e.target.value)}
                  required
                  className={`pl-10 h-12 rounded-lg transition-all duration-200 ${theme === "dark"
                      ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    } focus:border-accent focus:ring-blue-600/20`}
                />
              </div>
            </div>
 
            {/* Campo Senha */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                Senha
              </Label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`pl-10 h-12 rounded-lg transition-all duration-200 ${theme === "dark"
                      ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                    } focus:border-accent focus:ring-blue-600/20`}
                />
              </div>
            </div>
 
            {/* Campo Perfil */}
            <div className="space-y-2">
              <Label
                htmlFor="profile"
                className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                Selecione o seu perfil:
              </Label>
              <Select value={profile} onValueChange={setProfile}>
                <SelectTrigger
                  id="profile"
                  className={`h-12 rounded-lg transition-all duration-200 ${theme === "dark"
                      ? "bg-slate-950/50 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                    } focus:border-blue-600 focus:ring-blue-600/20`}
                >
                  <SelectValue placeholder="Escolha" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme === "dark"
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-slate-200"
                  }
                >
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Vendedor">Vendedor</SelectItem>
                  </SelectContent>
              </Select>
            </div>
 
            {/* Erro */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
 
            {/* Botão de login */}
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-primary text-white font-semibold h-12 rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200 mt-6"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar no Sistema"}
            </Button>
 
          </form>
        </div>
      </div>
    </div>
  )
}