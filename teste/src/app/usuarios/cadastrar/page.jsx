"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Cadastrar() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    re: "",
    senha: "",
    contato: "",
    sexo: "",
    cargo: "",
    vinculo: "",
    loja_vinculada: "",
  });
  const [lojas, setLojas] = useState([]);

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

  const handleCadastro = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome,
        cpf: form.cpf,
        re: form.re,
        senha: form.senha,
        contato: form.contato,
        sexo: form.sexo,
        cargo: form.cargo,
        vinculo: form.vinculo,
        loja_vinculada: form.loja_vinculada,
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok " + res.status);
    }

    const data = await res.json().then(() => {
      window.location.href = "/usuarios/gerenciador";
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    if (name == "vinculo") {
      setForm((prevData) => ({
        ...prevData,
        loja_vinculada: "",
      }));
    }
  };

  return (
    <div className="flex">
      <form className="flex flex-col">
        <h1>Login</h1>
        <label htmlFor="">Nome</label>
        <input
          type="text"
          onChange={handleChange}
          name="nome"
          value={form.nome}
          required
        />
        <label htmlFor="">Re</label>
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
        <label htmlFor="">CPF</label>
        <input
          type="number"
          onChange={handleChange}
          name="cpf"
          value={form.cpf}
          required
        />
        <label htmlFor="">Contato</label>
        <input
          type="text"
          onChange={handleChange}
          name="contato"
          value={form.contato}
          required
        />
        <label htmlFor="">Sexo</label>
        <input
          type="text"
          onChange={handleChange}
          name="sexo"
          value={form.sexo}
          required
        />
        <label htmlFor="">Cargo</label>
        <input
          type="text"
          onChange={handleChange}
          name="cargo"
          value={form.cargo}
          required
        />
        <label htmlFor="">vinculo</label>
        <select
          onChange={handleChange}
          name="vinculo"
          value={form.vinculo}
          required
        >
          <option value="" disabled>
            Selecione a Loja
          </option>
          <option value={"Matriz"}>Matriz</option>
          <option value={"Filial"}>Filial</option>
        </select>
        <label htmlFor="car-name">Loja vinculada</label>
        <select
          onChange={handleChange}
          name="loja_vinculada"
          value={form.loja_vinculada}
          required
        >
          <option value="" disabled>
            Selecione a Loja
          </option>
          {lojas ? (
            <>
              {lojas.map((loja, index) => {
                if (form.vinculo == "Matriz") {
                  if (loja.id == 1) {
                    return (
                      <option key={index} value={loja.id}>
                        {loja.nome}, {loja.localização}
                      </option>
                    );
                  }
                } else {
                  if (loja.id != 1) {
                    return (
                      <option key={index} value={loja.id}>
                        {loja.nome}, {loja.localização}
                      </option>
                    );
                  }
                }
              })}
            </>
          ) : (
            <>?</>
          )}
        </select>
        <button type="button" onClick={handleCadastro}>
          Enviar
        </button>
      </form>
    </div>
  );
}
