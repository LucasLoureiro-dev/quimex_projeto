import { listar_contas, criar_conta, atualizar_conta, excluir_conta } from "../models/contas.js";

const listar_contasController = async (req, res) => {
  try {
    const contas = await listar_contas();
    res.status(200).json({ contas });
  } catch (err) {
    console.error("Erro buscando contas:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar contas", error: err.message });
  }
};

const criar_contaController = async (req, res) => {
  try {
    const dados = req.body;
    const data = {
      preco: dados.valor,
      tipo: dados.tipo,
      loja: dados.filialId,
      descricao: dados.descricao,
      vencimento: dados.vencimento,
      estado: "pendente"
    };
    console.log(data, req.body);
    const criado = await criar_conta(data);
    res.status(200).json({ criado });
  } catch (err) {
    console.error("Erro criando contas:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar contas", error: err.message });
  }
};

const atualizar_contasController = async (req, res) => {
  try {
    const id = req.params.id;
    const dados = req.body;
    const date = new Date(dados.vencimento);
    const mysqlDateTime = date.toISOString().slice(0, 19).replace("T", " ");
    const data = {
      preco: dados.preco,
      tipo: dados.tipo,
      loja: dados.loja,
      descricao: dados.descricao,
      vencimento: mysqlDateTime,
      estado: dados.estado
    };
    const atualizado = await atualizar_conta(id, data);
    res.status(200).json({ atualizado });
  } catch (err) {
    console.error("Erro criando controle diário:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar controle diário", error: err.message });
  }
};

const excluir_contasController = async (req, res) => {
  try {
    const id = req.params.id;
    const contas = await excluir_conta(id);
    res.status(200).json({ contas });
  } catch (err) {
    console.error("Erro excluindo contas:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir contas", error: err.message });
  }
};

export {
  listar_contasController,
  criar_contaController,
  atualizar_contasController,
  excluir_contasController,
};
