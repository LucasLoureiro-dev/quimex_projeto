"use client"

import { Trash2, X, ShoppingCart } from "lucide-react"

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onClearCart, total }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Carrinho</h2>
            <span className="text-sm text-muted-foreground">
              ({items.length} {items.length === 1 ? "item" : "itens"})
            </span>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Carrinho vazio</p>
            <p className="text-xs text-muted-foreground mt-1">Adicione produtos para começar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="bg-secondary/50 rounded-lg p-3 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">R$ {item.price.toFixed(2)} cada</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 rounded bg-background border border-border hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <span className="text-sm font-medium">−</span>
                    </button>
                    <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 rounded bg-background border border-border hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <span className="text-sm font-medium">+</span>
                    </button>
                  </div>
                  <p className="text-base font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
