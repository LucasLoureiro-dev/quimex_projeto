"use client"
import Lojas from "@/app/lojas/page";
import { useState, useEffect } from "react";

export default function Gerenciador() {

    const [usuarios, setUsuarios] = useState('');
    const [lojas, setLojas] = useState('');
    const [editar, setEditar] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        re: "",
        contato: "",
        sexo: "",
        cargo: "",
        vinculo: "",
        loja_vinculada: ""
    });
    const [snapshot, setSnapshot] = useState({
        nome: "",
        cpf: "",
        re: "",
        contato: "",
        sexo: "",
        cargo: "",
        vinculo: "",
        loja_vinculada: ""
    });

    useEffect(() => {
        fetch(`http://localhost:8080/usuarios`, {
            method: "get",
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    if (res.status === 404) {
                        return [];
                    } else {
                        throw new Error("Erro ao buscar usuários");
                    }
                }
            })
            .then((data) => {
                setUsuarios(data.listaUsuarios);
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/lojas', {
            credentials: "include"
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setLojas(data.lojas);
            })
    }, []);

    const editarUsuario = (usuario) => {
        setEditar(true);
        setSnapshot({
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            re: usuario.RE,
            contato: usuario.contato,
            sexo: usuario.sexo,
            cargo: usuario.cargo,
            vinculo: usuario.vinculo,
            loja_vinculada: usuario.loja_vinculada
        });
        setFormData({
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            re: usuario.RE,
            contato: usuario.contato,
            sexo: usuario.sexo,
            cargo: usuario.cargo,
            vinculo: usuario.vinculo,
            loja_vinculada: usuario.loja_vinculada
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const repetido = usuarios.find(
            (usuario) =>
                usuario.cpf === formData.cpf ||
                usuario.RE === formData.re
        );

        if (JSON.stringify(snapshot) == JSON.stringify(formData)) {
            return alert('Não houve alterações');
        }
        else if (repetido) {
            if (repetido.id != formData.id) {
                return alert('Alguns dados entram em conflitos com outros usuários');
            }
        }
        fetch(`http://localhost:8080/usuarios/${formData.id}`, {
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
                        throw new Error("Erro ao atualizar usuários");
                    }
                }
            })
            .then((data) => {
                setSnapshot([]);
                console.log(data)
            });

    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/usuarios/${id}`, {
                method: "delete",
                credentials: "include"
            })

            if (!res.ok) {
                if (res.status === 400) {
                    alert(
                        "Não é possível excluir esta loja pois há registros vinculadas à ela."
                    );
                    return;
                } else {
                    throw new Error("Erro ao deletar loja");
                }
            } else {
                setLojas(usuarios.filter((usuario) => usuario.id !== id));
            }
        }
        catch (err) {

        }
    }
    return (
        <>
            <table style={{ borderCollapse: "collapse", width: "50%" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Nome</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>
                            CPF
                        </th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>RE</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Contato</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Sexo</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Cargo</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Vínculo</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Loja vinculada</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios && usuarios.length > 0 ? (
                        <>
                            {usuarios.map((usuario, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {usuario.nome}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {usuario.cpf}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {usuario.RE}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {usuario.contato}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {usuario.sexo}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {usuario.cargo}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {usuario.vinculo}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px" }}>
                                            {lojas
                                                ? (<>
                                                    {lojas.find((loja) => loja.id == usuario.loja_vinculada).nome}
                                                </>
                                                )
                                                : (
                                                    <>
                                                        ?
                                                    </>
                                                )}
                                        </td>
                                        <td className="border border-black px-4 py-2">
                                            <div className="flex space-x-2">
                                                {/* Edit Icon */}
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => editarUsuario(usuario)}
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
                                                    onClick={() => handleDelete(usuario.id)}
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
            {editar ? (
                <>
                    <form className="flex flex-col">
                        <br />
                        <br />
                        <label htmlFor="">Nome</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="nome"
                            value={formData.nome}
                            required
                        />
                        <label htmlFor="">Re</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="re"
                            value={formData.re}
                            required
                        />
                        <label htmlFor="">CPF</label>
                        <input
                            type="number"
                            onChange={handleChange}
                            name="cpf"
                            value={formData.cpf}

                            required
                        />
                        <label htmlFor="">Contato</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="contato"
                            value={formData.contato}
                            required
                        />
                        <label htmlFor="">Sexo</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="sexo"
                            value={formData.sexo}
                            required
                        />
                        <label htmlFor="">Cargo</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="cargo"
                            value={formData.cargo}
                            required
                        />
                        <label htmlFor="">vinculo</label>
                        <select onChange={handleChange}
                            name="vinculo"
                            value={formData.vinculo}
                            required>
                            <option value="" disabled>Selecione a Loja</option>
                            <option value={"Matriz"} >Matriz</option>
                            <option value={"Filial"}>Filial</option>
                        </select>
                        <label htmlFor="car-name">Loja vinculada</label>
                        <select onChange={handleChange}
                            name="loja_vinculada"
                            value={formData.loja_vinculada}
                            required>
                            <option value="" disabled>Selecione a Loja</option>
                            {lojas
                                ? (<>
                                    {lojas.map((loja, index) => {
                                        if (formData.vinculo == "Matriz") {
                                            if (loja.id == 1) {
                                                return (
                                                    <option key={index} value={loja.id}>{loja.nome}, {loja.localização}</option>
                                                )
                                            }
                                        }
                                        else {
                                            if (loja.id != 1) {
                                                return (
                                                    <option key={index} value={loja.id}>{loja.nome}, {loja.localização}</option>
                                                )
                                            }
                                        }
                                    })}
                                </>)
                                : (<>
                                    ?
                                </>)}
                        </select>
                        <button type="button" onClick={handleSubmit}>Enviar</button>
                    </form>
                </>
            ) : (
                <></>
            )}
        </>
    )
}