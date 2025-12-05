import {
  listar_produtos,
  criar_produto,
  atualizar_produto,
  excluir_produto,
} from "../models/Produtos.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    let capaPath = null;
    if (req.file) {
      capaPath = req.file.path.replace(
        __dirname.replace("\\controllers", ""),
        ""
      );
    }
    const data = {
      nome: produto.nome,
      codigo_de_barras: produto.codigo_de_barras,
      descricao: produto.descricao,
      preco: produto.preco,
      sku: produto.sku,
      quantidade: produto.quantidade,
      classificacao: produto.classificacao,
      fornecedor: produto.fornecedor,
      codigoCor: produto.codigoCor,
      imagem: capaPath,
      filial: produto.filial,
    };
    const criado = await criar_produto(data);
    res.status(200).json({ criado, capaPath });
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
    const id = req.params.id;
    let capaPath = null;
    if (req.file) {
      capaPath = req.file.path.replace(
        __dirname.replace("\\controllers", ""),
        ""
      );
    }
    const antigo = await listar_produtos();
    const imagem = antigo.find((e) => e.id == id).imagem;
    if (capaPath) {
      const pathToFile = `.${imagem}`;

      fs.unlink(pathToFile, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted!");
        }
      });
    }
    const data = {
      nome: produto.nome,
      codigo_de_barras: produto.codigo_de_barras,
      descricao: produto.descricao,
      preco: produto.preco,
      sku: produto.sku,
      quantidade: produto.quantidade,
      classificacao: produto.classificacao,
      fornecedor: produto.fornecedor,
      codigoCor: produto.codigoCor,
      imagem: capaPath ? capaPath : imagem,
      filial: produto.filial,
    };
    const path = capaPath ? capaPath : imagem;
    const atualizado = await atualizar_produto(id, data);
    res.status(200).json({ atualizado, path });
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
    const excluido = await excluir_produto(id);
    res.status(200).json({ excluido });
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
