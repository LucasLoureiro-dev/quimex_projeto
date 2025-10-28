"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Lojas() {
  const [lojas, setLojas] = useState([]);
  const [editar, setEditar] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    localizacao: "",
    cep: "",
    contato: "",
    horario_abertura: "",
    horario_fechamento: "",
  });
  const [editando, setEditando] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/lojas`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (response.status === 404) {
            return [];
          } else {
            throw new Error("Erro ao buscar chamadas das lojas");
          }
        }
      })
      .then((data) => {
        setLojas(data.lojas);
      });
  }, []);

  const editarLoja = (loja) => {
    setEditar(true)
    setFormData({
      id: loja.id,
      nome: loja.nome,
      localizacao: loja.localização,
      cep: loja.cep,
      contato: loja.contato,
      horario_abertura: loja.horario_abertura,
      horario_fechamento: loja.horario_fenchamento,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/lojas/${formData.id}`, {
      method: "put",
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
            throw new Error("Erro ao atualizar loja");
          }
        }
      })
      .then((data) => {
        window.location.href = "/lojas";
      });
  };

  return (
    <div className="flex flex-col">
      <table style={{ borderCollapse: "collapse", width: "50%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Nome</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Localização
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>CEP</th>
          </tr>
        </thead>
        <tbody>
          {lojas ? (
            <>
              {lojas.map((loja, index) => {
                return (
                  <tr key={index}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {loja.nome}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {loja.localização}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {loja.cep}
                    </td>
                    <td className="border border-black px-4 py-2">
                      <div className="flex space-x-2">
                        {/* Edit Icon */}
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => editarLoja(loja)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        {/* Delete Icon */}
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() =>
                            console.log("Delete clicked for", loja.nome)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              <tr>
                <td>Não há nenhuma loja</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <button
        onClick={() => (window.location.href = "/lojas/cadastrar")}
        className=" w-50 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      >
        Adicionar loja
      </button>

      {editar ? (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-white p-8 rounded-lg shadow-xl relative w-full max-w-lg mx-auto">
              {/* Close Button */}
              <button
                onClick={() => setEditar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>

              {/* Your Form Content */}
              <form
                onSubmit={handleSubmit}
                className="bg-white" // Remove bg-white and shadow-md as they are on the modal container
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
                  {/* You might want a cancel button here as well */}
                  <button
                    type="button" // Important: type="button" to prevent form submission
                    onClick={() => setEditar(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
