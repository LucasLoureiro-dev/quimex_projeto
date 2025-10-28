import {
    listar_controleDiario,
    criar_controleDiario
} from "../models/Controle_diario.js";

const listar_controleDiarioController = async (req, res) => {
  try {
     const controle_diario = await listar_controleDiario();
     res.status(200).json({ controle_diario });
  } catch (err) {
     console.error("Erro buscando controle diário:", err);
     res.status(500).json({ message: "Erro ao buscar controle diário", error: err.message });
  }
};

const criar_controleDiarioController = async (req, res) => {
  try {
     const { controle_diario } = req.body;
     const data = {
            funcionario: funcionario,
            abertura: abertura,
            fechamento: fechamento,
            loja: loja 
        }
    const criaControle = await criar_controleDiario(data)
     res.status(200).json({ criaControle });
  } catch (err) {
         console.error("Erro criando controle diário:", err);
     res.status(500).json({ message: "Erro ao criar controle diário", error: err.message });
  }
};

export {listar_controleDiarioController, criar_controleDiarioController}