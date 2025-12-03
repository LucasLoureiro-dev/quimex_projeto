"use client"

import { useState } from "react"
import { X, CreditCard, Banknote, Smartphone, Check } from "lucide-react"

export default function PaymentModal({ total, onClose, onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  const paymentMethods = [
    { id: "credit", name: "Cartão de Crédito", icon: CreditCard },
    { id: "debit", name: "Cartão de Débito", icon: CreditCard },
    { id: "cash", name: "Dinheiro", icon: Banknote },
    { id: "pix", name: "PIX", icon: Smartphone },
  ]

  const handlePayment = () => {
    if (!selectedMethod) return

    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
      setTimeout(() => {
        onComplete()
      }, 1500)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Finalizar Pagamento</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!completed ? (
            <>
              <div className="bg-primary/10 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Valor total</p>
                <p className="text-3xl font-bold text-primary">R$ {total.toFixed(2)}</p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  Selecione a forma de pagamento
                </p>

                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      disabled={processing}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          selectedMethod === method.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-foreground">{method.name}</span>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedMethod || processing}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Processando..." : "Confirmar Pagamento"}
              </button>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Pagamento Aprovado!</h3>
              <p className="text-sm text-muted-foreground">Venda finalizada com sucesso</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
