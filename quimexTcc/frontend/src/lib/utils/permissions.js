export function canAccessLoja(user, lojaId) {
  // Admin matriz pode acessar todas as lojas
  if (user.role === "admin_matriz") {
    return true
  }

  // Outros usuários só podem acessar sua própria loja
  return user.lojaId === lojaId
}

export function canViewConsolidated(user) {
  return user.role === "admin_matriz"
}

export function canManageLojas(user) {
  return user.role === "admin_matriz" || user.role === "gerente_filial"
}

export function canManageFuncionarios(user) {
  return user.role === "admin_matriz" || user.role === "gerente_filial"
}

export function canAccessPDV(user) {
  return user.role === "vendedor" || user.role === "gerente_filial"
}

export function canAccessFinanceiro(user) {
  return user.role === "admin_matriz" || user.role === "gerente_filial"
}

export function getRoleName(role) {
  const roles = {
    admin_matriz: "Administrador Matriz",
    gerente_filial: "Gerente de Filial",
    vendedor: "Vendedor/Caixa",
  }
  return roles[role]
}