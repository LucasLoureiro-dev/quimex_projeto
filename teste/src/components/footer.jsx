export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Quimx</h3>
            <p className="text-muted-foreground text-sm">Soluções químicas de excelência para sua empresa</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Produtos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Reagentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Industriais
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Especiais
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Tratamento
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#sobre" className="hover:text-foreground transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Certificações
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Sustentabilidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Carreiras
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#contato" className="hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Quimx. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
