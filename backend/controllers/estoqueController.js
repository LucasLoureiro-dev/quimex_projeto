import {
  listar_estoque,
  criar_estoque,
  atualizar_estoque,
  excluir_estoque,
} from "../models/Estoque.js";

const listar_estoqueController = async (req, res) => {
  try {
    const estoque = await listar_estoque();
    res.status(200).json({ estoque });
  } catch (err) {
    console.error("Erro buscando estoque:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar estoque", error: err.message });
  }
};

const criar_estoqueController = async (req, res) => {
  try {
    const { dados } = req.body;
    const data = {
      produto: dados.produto,
      quantidade: dados.quantidade,
      loja: dados.loja,
    };
    const criado = await criar_estoque(data);
    res.status(200).json({ data });
  } catch (err) {
    console.error("Erro criando estoque:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar estoque", error: err.message });
  }
};

const atualizar_estoqueController = async (req, res) => {
  try {
    const { dados } = req.body;
    const data = {
      produto: dados.produto,
      quantidade: dados.quantidade,
      loja: dados.loja,
    };
    const atualizado = await atualizar_estoque(data);
    res.status(200).json({ atualizado });
  } catch (err) {
    console.error("Erro criando estoque:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar estoque", error: err.message });
  }
};

const excluir_estoqueController = async (req, res) => {
  try {
    const id = req.params.id;
    const excluido = await excluir_estoque(id);
    res.status(200).json({ mensagem: "Estoque excluído com sucesso" });
  } catch (err) {
    console.error("Erro excluindo estoque:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir estoque", error: err.message });
  }
};

export {
  listar_estoqueController,
  criar_estoqueController,
  atualizar_estoqueController,
  excluir_estoqueController,
};
