"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Lojas() {
  const [formData, setFormData] = useState({
    nome: "",
    localizacao: "",
    cep: "",
    contato: "",
    horario_abertura: "",
    horario_fechamento: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:8080/lojas`);

    const data = await res.json();

    const conflito =
      data.lojas.find((loja) => loja.nome == formData.nome) ||
      data.lojas.find((loja) => loja.cep == formData.cep);

    const start = `${formData.horario_abertura}`;
    const end = `${formData.horario_fechamento}`;

    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    const diffMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (conflito) {
      alert(
        "Oops, nome/localização estão entrando em conflito com outra loja, verifique os dados e tente novamente."
      );
      return;
    } else if (hours < 8) {
      alert(
        "A loja deve estar aberta pelo menos 8 horas por dia."
      );
      return;
    } else {
      fetch(`http://localhost:8080/lojas`, {
        method: "post",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            if (res.status === 500) {
              return [];
            } else {
              throw new Error("Erro ao cadastrar loja");
            }
          }
        })
        .then((data) => {
          window.location.href = "/lojas";
        });
    }
  };
  return (
    <div className="flex justify-center my-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Detalhes do Estabelecimento
        </h2>

        <div className="mb-4">
          <label
            htmlFor="nome"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Nome do estabelecimento"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="localizacao"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Localização:
          </label>
          <input
            type="text"
            id="localizacao"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Endereço completo"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cep"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CEP:
          </label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="00000-000"
            maxLength="9"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="contato"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Contato:
          </label>
          <input
            type="tel"
            id="contato"
            name="contato"
            value={formData.contato}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="(DD) 9XXXX-XXXX"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="horario_abertura"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Horário de Abertura:
          </label>
          <input
            type="time"
            id="horario_abertura"
            name="horario_abertura"
            value={formData.horario_abertura}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="horario_fechamento"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Horário de Fechamento:
          </label>
          <input
            type="time"
            id="horario_fechamento"
            name="horario_fechamento"
            value={formData.horario_fechamento}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
