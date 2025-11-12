"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    re: "",
    senha: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/login`, {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Sending JSON data
      },
      body: JSON.stringify({
        RE: form.re,
        senha: form.senha,
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      if (res.status == 401) {
        alert('Usuário ou senha inválidos');
      }
      if (res.status == 404) {
        alert('Usuário não encontrado');
      }
    }

    const data = await res.json();

    if (data.cargo == "Administrador") {
      window.location.href = "/dashboard/adm";
    } else if (data.cargo == "Gerente") {
      window.location.href = "/dashboard/gerente";
    } else if (data.cargo == "Vendedor") {
      window.location.href = "/dashboard/pdv";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="flex">
      <form onSubmit={handleLogin} className="flex flex-col">
        <h1>Login</h1>
        <label htmlFor="">RE</label>
        <input
          type="text"
          onChange={handleChange}
          name="re"
          value={form.re}
          required
        />
        <label htmlFor="">Senha</label>
        <input
          type="text"
          onChange={handleChange}
          name="senha"
          value={form.senha}
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
