"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Lojas() {
  const [formData, setformData] = useState({
    nome: "",
    contato: "",
    localizacao: "",
    cnpj: "",
    loja_vinculada: "",
    tipo_produto: "",
  });

  const [lojas, setLojas] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetch("http://localhost:8080/lojas", {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLojas(data.lojas);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:8080/fornecedores`, {
      credentials: "include",
    });

    let data;
    let conflito;

    if (res.status != 404) {
      data = await res.json();
    }

    if(data){
      conflito =
      data.fornecedores.find(
        (fornecedor) => fornecedor.nome == formData.nome
      ) ||
      data.fornecedores.find((fornecedor) => fornecedor.cnpj == formData.cnpj);
    }
    if (conflito) {
      alert(
        "Oops, nome/localização estão entrando em conflito com outra loja, verifique os dados e tente novamente."
      );
      return;
    } else {
      fetch(`http://localhost:8080/fornecedores`, {
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
        // .then((data) => {
        //   window.location.href = "/lojas";
        // });
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
            Contato:
          </label>
          <input
            type="text"
            id="contato"
            name="contato"
            value={formData.contato}
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
            Localização:
          </label>
          <input
            type="text"
            id="localizacao"
            name="localizacao"
            value={formData.localizacao}
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
            CNPJ:
          </label>
          <input
            type="tel"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
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
            Loja Vinculada:
          </label>
          <select
            onChange={handleChange}
            name="loja_vinculada"
            value={formData.loja_vinculada}
            required
          >
            <option value="" disabled>
              Selecione a Loja
            </option>
            {lojas ? (
              <>
                {lojas.map((loja, index) => {
                  return (
                    <option key={index} value={loja.id}>
                      {loja.nome}, {loja.localização}
                    </option>
                  );
                })}
              </>
            ) : (
              <>?</>
            )}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="horario_fechamento"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Tipo de produto:
          </label>

          <select
            type="time"
            id="tipo_produto"
            name="tipo_produto"
            value={formData.tipo_produto}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Selecione a Loja
            </option>
            <option>Oi</option>
            <option>Oi2</option>
            <option>Oi3</option>
          </select>
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
