import {
  listar_produtos,
  criar_produto,
  atualizar_produto,
  excluir_produto,
} from "../models/Produtos.js";

const listar_produtosController = async (req, res) => {
  try {
    const produtos = await listar_produtos();
    res.status(200).json({ produtos });
  } catch (err) {
    console.error("Erro buscando produtos:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: err.message });
  }
};

const criar_produtoController = async (req, res) => {
  try {
    const produto = req.body;
    const data = {
      nome: produto.nome,
      codigo_de_barras: produto.codigo_de_barras,
      descricao: produto.descricao,
      fornecedor: produto.fornecedor,
      preco: produto.preco,
    };
    const criado = await criar_produto(data);
    res.status(200).json({ criado });
  } catch (err) {
    console.error("Erro criando produto:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar produto", error: err.message });
  }
};

const atualizar_produtoController = async (req, res) => {
  try {
    const produto = req.body;
    const data = {
      nome: produto.nome,
      codigo_de_barras: produto.codigo_de_barras,
      descricao: produto.descricao,
      fornecedor: produto.fornecedor,
      preco: produto.preco,
    };
    const atualizado = await atualizar_produto(data);
    res.status(200).json({ atualizado });
  } catch (err) {
    console.error("Erro atualizando produto:", err);
    res
      .status(500)
      .json({ message: "Erro ao atualizar produto", error: err.message });
  }
};

const excluir_produtoController = async (req, res) => {
  try {
    const id = req.params.id;
    const excluir_produto = await excluir_produto(id);
    res.status(200).json({ controle_diario });
  } catch (err) {
    console.error("Erro excluindo produto:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir produtos", error: err.message });
  }
};

export {
  listar_produtosController,
  criar_produtoController,
  atualizar_produtoController,
  excluir_produtoController,
};
