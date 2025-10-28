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
        if (response.status === 404) {
          return [];
        } else {
          throw new Error("Erro ao buscar chamadas do usuário");
        }
      }
    })
    .then((data)=>{
        setUsuario(data);
    })
  }, []);

  return (
    <div className="flex">
      <h2>Ola {usuario.usuario}</h2>
      <h3>{usuario.cargo}</h3>
    </div>
  );
}
