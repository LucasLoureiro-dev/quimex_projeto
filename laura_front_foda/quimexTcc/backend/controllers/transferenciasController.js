import { listar_transferencias, criar_transferencia, atualizar_transferencia, excluir_transferencia } from "../models/trasferencias.js";

const listar_transferenciasController = async (req, res) => {
  try {
    const trasferencias = await listar_transferencias();
    res.status(200).json({ trasferencias });
  } catch (err) {
    console.error("Erro buscando trasferencias:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar trasferencias", error: err.message });
  }
};

const criar_transferenciaController = async (req, res) => {
  try {
    console.log(req.body)
    const dados  = req.body;
    const data = {
      loja: dados.loja,
      produto: dados.produto,
      quantidade_produto: dados.quantidade_produto,
      preco: dados.preco,
      troco: dados.troco,
    };
    console.log(data)
    const criado = await criar_transferencia(data);
    res.status(200).json({ criado });
  } catch (err) {
    console.error("Erro criando trasferencias:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar trasferencias", error: err.message });
  }
};

const atualizar_transferenciaController = async (req, res) => {
  try {
    const dados = req.body;
    const data = {
      loja: dados.funcionario,
      valor: dados.abertura,
      data: dados.fechamento,
      descricao: dados.loja,
      tipo: dados.tipo,
    };
    const atualizado = await atualizar_transferencia(data);
    res.status(200).json({ atualizado });
  } catch (err) {
    console.error("Erro criando controle diário:", err);
    res
      .status(500)
      .json({ message: "Erro ao criar controle diário", error: err.message });
  }
};

const excluir_transferenciasController = async (req, res) => {
  try {
    const id = req.params.id;
    const trasferencias = await excluir_transferencia(id);
    res.status(200).json({ trasferencias });
  } catch (err) {
    console.error("Erro excluindo trasferencias:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir trasferencias", error: err.message });
  }
};

export {
  listar_transferenciasController,
  criar_transferenciaController,
  atualizar_transferenciaController,
  excluir_transferenciasController,
};
