"use client"

import { ShoppingBag, Coffee, Sandwich, Cookie } from "lucide-react"

const PRODUCTS = [
  { id: "1", name: "Café Expresso", price: 5.5, icon: Coffee, category: "Bebidas" },
  { id: "2", name: "Cappuccino", price: 7.0, icon: Coffee, category: "Bebidas" },
  { id: "3", name: "Café com Leite", price: 6.0, icon: Coffee, category: "Bebidas" },
  { id: "4", name: "Suco Natural", price: 8.5, icon: ShoppingBag, category: "Bebidas" },
  { id: "5", name: "Sanduíche Natural", price: 12.0, icon: Sandwich, category: "Comidas" },
  { id: "6", name: "Pão de Queijo", price: 4.5, icon: Cookie, category: "Comidas" },
  { id: "7", name: "Croissant", price: 6.5, icon: Cookie, category: "Comidas" },
  { id: "8", name: "Bolo Caseiro", price: 8.0, icon: Cookie, category: "Comidas" },
  { id: "9", name: "Água Mineral", price: 3.0, icon: ShoppingBag, category: "Bebidas" },
  { id: "10", name: "Refrigerante", price: 5.0, icon: ShoppingBag, category: "Bebidas" },
  { id: "11", name: "Misto Quente", price: 10.0, icon: Sandwich, category: "Comidas" },
  { id: "12", name: "Brownie", price: 7.5, icon: Cookie, category: "Comidas" },
]

export default function ProductGrid({ onAddToCart }) {
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)))

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg font-semibold mb-3 text-foreground">{category}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {PRODUCTS.filter((p) => p.category === category).map((product) => {
              const Icon = product.icon
              return (
                <button
                  key={product.id}
                  onClick={() => onAddToCart(product)}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-foreground">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
