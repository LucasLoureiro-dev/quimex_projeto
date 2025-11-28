import { CheckCircle2 } from "lucide-react"

export function AboutSection() {
  const features = [
    "Produtos certificados e de alta qualidade",
    "Equipe técnica especializada",
    "Entrega rápida em todo o Brasil",
    "Suporte técnico 24/7",
    "Preços competitivos",
    "Compromisso com sustentabilidade",
  ]

  return (
    <section id="sobre" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Sobre a Quimx</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Há mais de 25 anos no mercado, a Quimx é referência nacional em fornecimento de produtos químicos para
              indústrias e laboratórios.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Nossa missão é fornecer soluções químicas de excelência, combinando qualidade, segurança e inovação para
              impulsionar o sucesso dos nossos clientes.
            </p>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
              <img src="/modern-chemical-laboratory-with-scientists-working.jpg" alt="Laboratório Quimx" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-secondary/10 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
