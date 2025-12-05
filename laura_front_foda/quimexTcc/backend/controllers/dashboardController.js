const dashboardController = async (req, res) => {
  try {
    res.status(200).json({
      id: req.session.usuario.Id,
      usuario: req.session.usuario.Nome,
      cargo: req.session.usuario.Cargo,
      vinculo: req.session.usuario.Vinculo,
      Loja_vinculada: req.session.usuario.Loja_vinculada,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
};

export { dashboardController };
