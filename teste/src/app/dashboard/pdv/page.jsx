"use client"
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {

  const [usuario, setUsuario] = useState('');

  useEffect(()=>{
    fetch('http://localhost:8080/')
  }, []);

  return (
    <div className="flex">
      <form onSubmit={handleLogin} className="flex flex-col">
        <h1>Login</h1>
        <label htmlFor="">RE</label>
        <input type="text" onChange={handleChange} name="re"/>
        <label htmlFor="">Senha</label>
        <input type="text" onChange={handleChange} name="senha"/>
        <button type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}
