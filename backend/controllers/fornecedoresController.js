import {
  listar_fornecedores,
  criar_fornecedores,
  atualizar_fornecedores,
  excluir_fornecedores,
} from "../models/Fornecedores.js";

const listar_fornecedoresController = async (req, res) => {
  try {
    const fornecedores = await listar_fornecedores();
    res.status(200).json({ fornecedores });
  } catch (err) {
    console.error("Erro buscando fornecedores:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar fornecedores", error: err.message });
  }
};

const criar_fornecedorCotnroller = async (req, res) => {
  try {
    const { nome, contato, localizacao, cnpj, tipo_produto, loja_vinculada } =
      req.body;
    const data = {
      nome: nome,
      contato: contato,
      localizacao: localizacao,
      cnpj: cnpj,
      tipo_produto: tipo_produto,
      loja_vinculada: loja_vinculada,
    };
    const criado = await criar_fornecedores(data);
    res.status(200).json({ criado });
  } catch (err) {
    console.error("Erro criando fornecedor:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar fornecedor", error: err.message });
  }
};

const atualizar_fornecedorController = async (req, res) => {
  try {
    const { nome, contato, localização, cnpj, tipo_produto, loja_vinculada } =
      req.body;
    const data = {
      nome: nome,
      contato: contato,
      localização: localização,
      cnpj: cnpj,
      tipo_produto: tipo_produto,
      loja_vinculada: loja_vinculada,
    };
    const criado = await atualizar_fornecedores(data);
    res.status(200).json({ criado });
  } catch (err) {
    console.error("Erro criando fornecedor:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar fornecedor", error: err.message });
  }
};

const excluir_fornecedoresController = async (req, res) => {
  try {
    const id = req.params.id;
    const excluido = await excluir_fornecedores(id);
    res.status(200).json({ "mensagem": "Fornecedor excluído com sucesso"});
  } catch (err) {
    console.error("Erro excluindo produto químico:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir produto químico", error: err.message });
  }
};

export {
  listar_fornecedoresController,
  criar_fornecedorCotnroller,
  atualizar_fornecedorController,
  excluir_fornecedoresController,
};