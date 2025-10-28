import {
    listar_despesas,
    criar_despesa,
    atualizar_despesa,
    excluir_despesa
} from "../models/Despesas.js";

const listar_despesasController = async (req, res) => {
  try {
     const despesas = await listar_despesas();
     res.status(200).json({ despesas });
  } catch (err) {
     console.error("Erro buscando despesas:", err);
     res.status(500).json({ message: "Erro ao buscar despesas", error: err.message });
  }
};

const criar_despesaController = async (data) => {
  try {
     const { dados } = req.body;
     const data = {
            funcionario: funcionario,
            abertura: abertura,
            fechamento: fechamento,
            loja: loja 
        }
      const criaDespesa = await criar_despesa(data);
     res.status(200).json({ data });
  } catch (err) {
         console.error("Erro criando controle despesas:", err);
     res.status(500).json({ message: "Erro ao criar controle despesas", error: err.message });
  }
};


const atualizar_despesasController = async (data) => {
  try {
     const { dados } = req.body;
     const data = {
            funcionario: funcionario,
            abertura: abertura,
            fechamento: fechamento,
            loja: loja 
        }
      const atualizarDespesa = await atualizar_despesa(data);
     res.status(200).json({ data });
  } catch (err) {
         console.error("Erro criando controle diário:", err);
     res.status(500).json({ message: "Erro ao criar controle diário", error: err.message });
  }
};


const excluir_despesasController = async (req, res) => {
  try {
   const id = req.params.id;
     const despesas = await excluir_despesa(id);
     res.status(200).json({ despesas });
  } catch (err) {
     console.error("Erro excluindo despesas:", err);
     res.status(500).json({ message: "Erro ao excluir despesas", error: err.message });
  }
};

export {listar_despesasController, criar_despesaController}