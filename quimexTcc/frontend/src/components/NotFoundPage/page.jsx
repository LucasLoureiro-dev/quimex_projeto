"use client";
import React, { useState, useEffect } from 'react';

// Componente para a partícula flutuante no fundo (mais sutil agora)
const FloatingParticle = ({ style }) => (
    <div
        className="absolute rounded-full bg-teal-400/10 particle-animation"
        style={style}
    />
);

// Ícone SVG Profissional de "Ligação Quebrada" ou Erro de Conexão
const ProfessionalErrorSVG = (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-teal-500 w-32 h-32 md:w-40 md:h-40 opacity-90"
    >
        {/* Fundo sutil para o 404 */}
        <circle cx="12" cy="12" r="10" strokeDasharray="5 5" opacity="0.1"/>
        
        {/* Link 1 (Top Left) */}
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" className="text-teal-600"/>
        
        {/* A quebra no meio, destacada em tom de erro */}
        <line x1="12" y1="12" x2="12" y2="12" strokeWidth="4" className="text-red-500"/>
        
        {/* Link 2 (Bottom Right) */}
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" className="text-emerald-600"/>
        
        {/* Um aviso de exclamação no centro */}
        <path d="M12 8l0 4" stroke="#F59E0B" strokeWidth="2.5"/>
        <path d="M12 16l0 0" stroke="#F59E0B" strokeWidth="2.5"/>
    </svg>
);


// Componente Principal
export default function App() {
    // Estilos das partículas para o fundo animado
    const particleStyles = [...Array(8)].map((_, i) => ({ // Menos partículas
        left: `${Math.random() * 100}%`,
        bottom: `-100px`,
        width: `${10 + Math.random() * 20}px`, // Partículas menores
        height: `${10 + Math.random() * 20}px`,
        animationDelay: `${i * 1.5}s`,
        animationDuration: `${20 + Math.random() * 15}s`, // Mais lentas
    }));


    return (
        <div className="relative min-h-screen font-sans overflow-hidden bg-white flex items-center justify-center p-4">

            {/* Início do bloco de estilo para as animações customizadas */}
            <style jsx="true">{`
                /* Animação de flutuação mais lenta e discreta */
                @keyframes float-particles {
                    0% { transform: translateY(100vh) rotate(0deg) scale(0.6); opacity: 0; }
                    10% { opacity: 0.1; }
                    80% { opacity: 0.1; }
                    100% { transform: translateY(-100px) rotate(360deg) scale(0.8); opacity: 0; }
                }
                @keyframes float-gentle {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); } /* Movimento reduzido */
                    100% { transform: translateY(0px); }
                }
                .particle-animation {
                    animation: float-particles linear infinite;
                }
                .animate-float-gentle {
                    animation: float-gentle 4s ease-in-out infinite;
                }
            `}</style>
            {/* Fim do bloco de estilo */}


            {/* Fundo com partículas sutis (sem emojis) */}
            <div className="absolute inset-0 overflow-hidden opacity-50 bg-gradient-to-br from-teal-50 to-white">
                {particleStyles.map((style, i) => (
                    <FloatingParticle key={i} style={style} />
                ))}
            </div>

            {/* Cartão principal */}
            <div className="relative z-10 w-full max-w-4xl px-4">
                <div className="bg-white rounded-xl shadow-2xl shadow-gray-200 p-8 md:p-12 lg:p-16 border border-gray-100/50">

                    {/* SVG com animação suave */}
                    <div className="flex justify-center mb-6">
                        <div className="relative animate-float-gentle">
                            {ProfessionalErrorSVG}
                        </div>
                    </div>

                    <h1 className="text-center text-[100px] sm:text-[120px] md:text-[140px] font-extrabold leading-tight mb-2 bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 bg-clip-text text-transparent">
                        404
                    </h1>

                    {/* Texto mais formal e direto */}
                    <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Página Não Localizada
                    </h2>

                    <p className="text-center text-lg md:text-xl font-medium text-gray-600 mb-8 max-w-3xl mx-auto">
                        O recurso solicitado não pôde ser encontrado em nosso servidor.
                    </p>

                    <p className="text-center text-base text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
                        Verifique o endereço digitado ou utilize os botões abaixo para retornar à área principal ou entrar em contato com o suporte.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="/"
                            className="w-full sm:w-auto px-10 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md shadow-teal-500/30 hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300 text-center active:scale-95"
                        >
                            Ir para a Página Inicial
                        </a>
                        <a
                            href="/contato"
                            className="w-full sm:w-auto px-10 py-3 bg-white text-teal-600 font-semibold rounded-lg border-2 border-teal-600 shadow-md shadow-gray-300 hover:bg-teal-50 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300 text-center active:scale-95"
                        >
                            Reportar um Erro
                        </a>
                    </div>

                </div>
            </div>

        </div>
    );
}