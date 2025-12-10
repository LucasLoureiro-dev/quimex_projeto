import {
  listar_lojas,
  criar_loja,
  atualizar_loja,
  excluir_loja,
} from "../models/lojas.js";

const listar_lojasController = async (req, res) => {
  try {
    const lojas = await listar_lojas();
    res.status(200).json({ lojas });
  } catch (err) {
    console.error("Erro buscando lojas:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar lojas", error: err.message });
  }
};

const criar_lojaController = async (req, res) => {
  try {
    const {
      nome,
      cnpj,
      localizacao,
      estado,
      contato,
      tipo,
      horario_abertura,
      horario_fechamento,
    } = req.body;
    const data = {
      nome: nome,
      cnpj: cnpj,
      localização: localizacao,
      estado: estado,
      contato: contato,
      tipo: tipo,
      horario_abertura: horario_abertura,
      horario_fechamento: horario_fechamento,
    };
    const criado = await criar_loja(data);
    res.status(200).json({ criado });
  } catch (err) {
    console.error("Erro criando loja:", err);
    res.status(500).json({ message: "Erro ao criar loja", error: err.message });
  }
};

const atualizar_lojaController = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nome,
      cnpj,
      localizacao,
      estado,
      contato,
      tipo,
      horario_abertura,
      horario_fechamento,
    } = req.body;
    const data = {
      nome: nome,
      cnpj: cnpj,
      localizacao: localizacao,
      estado: estado,
      contato: contato,
      tipo: tipo,
      horario_abertura: horario_abertura,
      horario_fechamento: horario_fechamento,
    };
    const atualizado = await atualizar_loja(id, data);
    res.status(200).json({ atualizado });
  } catch (err) {
    console.error("Erro atualizando produto químico:", err);
    res
      .status(500)
      .json({
        message: "Erro ao atualizar produto químico",
        error: err.message,
      });
  }
};

const excluir_lojaController = async (req, res) => {
  try {
    const id = req.params.id;
    const excluir_produto = await excluir_loja(id);
    res.status(200).json({ controle_diario });
  } catch (err) {
    console.error("Erro excluindo produto químico:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir produto químico", error: err.message });
  }
};

export {
  listar_lojasController,
  criar_lojaController,
  atualizar_lojaController,
  excluir_lojaController,
};
