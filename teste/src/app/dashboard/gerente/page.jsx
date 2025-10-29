"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {

    const [usuario, setUsuario] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/dashboard`, {
      method: "get",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        if (res.status == 404) {
          return [];
        } else if (res.status == 403) {
          window.location.href = "/forbidden";
        }
        else if (res.status == 401) {
          window.location.href = "/unauthorized";
        }
        else {
          alert('Houve um problema ao buscar usuário');
        }
      }
    })
      .then((data) => {
        if (data.cargo != 'Gerente') {
          window.location.href = "/forbidden";
        }
        else {
          setUsuario(data);
        }
      })
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra Lateral Escalável */}
      <aside className="w-64 bg-gray-50 text-black flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Meu Painel
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              {/* Em um aplicativo Next.js real, considere usar <Link href="/login"><a>Login</a></Link> */}
              <a href="/login" className="block py-2 px-4 rounded hover:bg-gray-200">Login</a>
            </li>
            <li>
              {/* Em um aplicativo Next.js real, considere usar <Link href="/dashboard"><a>Painel</a></Link> */}
              <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200">Painel</a>
            </li>
            <li>
              {/* Em um aplicativo Next.js real, considere usar <Link href="/stores"><a>Lojas</a></Link> */}
              <a href="/stores" className="block py-2 px-4 rounded hover:bg-gray-200">Lojas</a>
            </li>
            {/* Itens futuros podem ser adicionados aqui facilmente adicionando mais elementos <li> */}
            <li>
              <a href="/settings" className="block py-2 px-4 rounded hover:bg-gray-200">Configurações</a>
            </li>
            <li>
              <a href="/reports" className="block py-2 px-4 rounded hover:bg-gray-200">Relatórios</a>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; 2023 MinhaEmpresa
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel exemplo</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Informações do Usuário</h2>
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-medium">Nome:</span> {usuario.usuario}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Ocupação:</span> {usuario.cargo}
          </p>
          <img src="/juan.jfif" alt="" className="w-screen h-35" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Visão Geral do Painel</h2>
          <p className="text-gray-600">
            É aqui que o conteúdo principal do seu painel seria exibido. Você pode adicionar gráficos, tabelas, relatórios, etc., aqui.
          </p>
        </div>
      </main>
    </div>
  );
}
