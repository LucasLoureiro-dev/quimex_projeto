// Marca este componente como um Componente de Cliente, permitindo o uso de hooks do React.
"use client"; 

// Importa os hooks useState e useEffect do React
import { useState, useEffect } from "react";

// Definindo o componente principal 'Loading'
export default function Loading() {
  // Declara um estado para controlar o progresso da barra de carregamento
  const [progress, setProgress] = useState(0);

  // 'useEffect' para iniciar o aumento do progresso da barra após o componente ser montado
  useEffect(() => {
    // Cria um intervalo para aumentar o progresso a cada 50 milissegundos
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Verifica se o progresso é menor que 100%
        if (prevProgress < 100) {
          return prevProgress + 1; // Aumenta o progresso em 1% a cada intervalo
        }
        // Quando o progresso chega a 100%, limpa o intervalo
        clearInterval(interval);
        return 100; // Garante que o progresso não ultrapasse 100%
      });
    }, 50); // Atualiza a cada 50ms

    // Limpeza do intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, []); // O array vazio significa que o 'useEffect' será executado apenas uma vez após o componente ser montado

  // Retorno do JSX que representa a interface do componente
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Contêiner flexível para centralizar o conteúdo */}
      <div className="flex flex-col items-center gap-8">
        
        {/* Animação de estrutura molecular */}
        <div className="relative h-32 w-32">
          
          {/* Átomo central (estático) */}
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-pulse-ring" />

          {/* Átomos em órbita (movendo-se em torno do átomo central) */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-secondary" />
          </div>

          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s", animationDirection: "reverse" }}
          >
            <div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-accent" />
          </div>

          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "5s" }}>
            <div className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-secondary" />
          </div>

          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4.5s", animationDirection: "reverse" }}
          >
            <div className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-accent" />
          </div>

          {/* Anéis orbitais (simulação de órbitas) */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-4 rounded-full border-2 border-secondary/20" />
        </div>

        {/* Texto de carregamento */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-semibold text-foreground">Carregando</h2>
          <p className="text-sm text-muted-foreground">Preparando soluções químicas...</p>
        </div>

        {/* Barra de progresso */}
        <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }} // A largura da barra de progresso é definida pelo valor do estado 'progress'
          />
        </div>
      </div>
    </div>
  );
}
