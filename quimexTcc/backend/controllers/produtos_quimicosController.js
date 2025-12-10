import {
 listar_produtosQuimicos, criar_produtoQuimicos, atualizar_produtoQuimico, excluir_produtoQuimico 
} from "../models/Produtos_quimicos.js";

const listar_produtos_quimicosController = async (req, res) => {
  try {
    const produtos = await listar_produtosQuimicos();
    res.status(200).json({ produtos });
  } catch (err) {
    console.error("Erro buscando produtos químicos:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos químicos", error: err.message });
  }
};

const criar_produto_quimicosController = async (req, res) => {
  try {
    const { produto } = req.body;
    const data = {
      nome : nome ,
      codigo_de_barras : codigo_de_barras ,
      descricao : descricao ,
      fornecedor : fornecedor ,
      preco : preco 
    };
    const criado = await criar_produtoQuimicos(data);
    res.status(200).json({ criado });
  } catch (err) {
    console.error("Erro criando produto químico:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar produto químico", error: err.message });
  }
};

const atualizar_produto_quimicosController = async (req, res) => {
  try {
     const { produto } = req.body;
    const data = {
      nome : nome ,
      codigo_de_barras : codigo_de_barras ,
      descricao : descricao ,
      fornecedor : fornecedor ,
      preco : preco 
    };
    const atualizado  = await atualizar_produtoQuimico(data);
    res.status(200).json({ atualizado });
  } catch (err) {
    console.error("Erro atualizando produto químico:", err);
    res
      .status(500)
      .json({ message: "Erro ao atualizar produto químico", error: err.message });
  }
};

const excluir_produto_quimicosController = async (req, res) => {
  try {
    const id = req.params.id;
    const excluir_produto = await excluir_produtoQuimico(id);
    res.status(200).json({ controle_diario });
  } catch (err) {
    console.error("Erro excluindo produto químico:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir produto químico", error: err.message });
  }
};

export { listar_produtos_quimicosController, criar_produto_quimicosController, atualizar_produto_quimicosController, excluir_produto_quimicosController };
