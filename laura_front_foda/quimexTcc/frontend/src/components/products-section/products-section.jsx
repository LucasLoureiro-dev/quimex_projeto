import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag as Flask, Droplet, Atom, Zap, Shield, Leaf } from "lucide-react"

export function ProductsSection() {
  const categories = [
    {
      icon: Flask,
      title: "Reagentes Laboratoriais",
      description: "Reagentes de alta pureza para análises químicas e pesquisas científicas",
      products: ["Ácidos", "Bases", "Solventes", "Indicadores"],
    },
    {
      icon: Droplet,
      title: "Produtos Industriais",
      description: "Soluções químicas para processos industriais e manufatura",
      products: ["Desengraxantes", "Neutralizantes", "Catalisadores", "Aditivos"],
    },
    {
      icon: Atom,
      title: "Químicos Especiais",
      description: "Produtos químicos especializados para aplicações específicas",
      products: ["Polímeros", "Resinas", "Compostos Orgânicos", "Intermediários"],
    },
    {
      icon: Zap,
      title: "Tratamento de Água",
      description: "Produtos para tratamento e purificação de água industrial",
      products: ["Coagulantes", "Floculantes", "Biocidas", "Antiespumantes"],
    },
    {
      icon: Shield,
      title: "EPIs e Segurança",
      description: "Equipamentos de proteção e produtos para segurança química",
      products: ["Luvas", "Máscaras", "Absorventes", "Neutralizadores"],
    },
    {
      icon: Leaf,
      title: "Produtos Sustentáveis",
      description: "Soluções químicas ecológicas e biodegradáveis",
      products: ["Bio-solventes", "Surfactantes Verdes", "Enzimas", "Biopolímeros"],
    },
  ]

  return (
    <section id="produtos" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Nossos Produtos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Amplo portfólio de produtos químicos para atender todas as necessidades da sua empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-base">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {category.products.map((product) => (
                      <li key={product} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {product}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Catálogo
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
