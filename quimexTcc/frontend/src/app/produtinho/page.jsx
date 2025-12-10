"use client"
import React, { useState, useEffect } from 'react';
import { Hexagon, FlaskConical, Copy, Check } from 'lucide-react';

// Função utilitária para converter HEX para RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
};

// Função utilitária para converter RGB para HEX
const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
        const hex = Math.max(0, Math.min(255, Number(c))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
};

export default function PaintMixerPage() {
    // Estado inicial (Branco)
    const [color, setColor] = useState("#ffffff");
    const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });
    const [copied, setCopied] = useState(false);

    // Atualiza RGB quando o Hex muda (ex: via color picker nativo)
    const handleHexChange = (e) => {
        const newHex = e.target.value;
        setColor(newHex);
        setRgb(hexToRgb(newHex));
    };

    // Atualiza Hex quando os inputs RGB mudam
    const handleRgbChange = (key, value) => {
        const newRgb = { ...rgb, [key]: parseInt(value) || 0 };
        setRgb(newRgb);
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    // Copiar código da cor
    const copyToClipboard = () => {
        navigator.clipboard.writeText(color.toUpperCase());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* CARD 1: O Balde de Tinta (Visualização) */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-semibold text-gray-800">Visualização</h2>
                        <p className="text-sm text-gray-500">Veja como a cor fica aplicada no produto.</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-10 bg-gray-100/50 relative">
                        {/* SVG Desenhado manualmente para simular o balde 3D */}
                        <svg
                            width="300"
                            height="300"
                            viewBox="0 0 200 220"
                            className="drop-shadow-2xl transition-all duration-300"
                        >
                            <defs>
                                <linearGradient id="canMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#d1d5db" />
                                    <stop offset="20%" stopColor="#f3f4f6" />
                                    <stop offset="50%" stopColor="#ffffff" />
                                    <stop offset="80%" stopColor="#d1d5db" />
                                    <stop offset="100%" stopColor="#9ca3af" />
                                </linearGradient>
                                <filter id="shadow">
                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
                                </filter>
                            </defs>

                            {/* Alça do balde (trás) */}
                            <path d="M 20 60 C 20 20, 180 20, 180 60" fill="none" stroke="#9ca3af" strokeWidth="4" />

                            {/* Corpo do Balde */}
                            <path d="M 20 60 L 20 180 C 20 200, 180 200, 180 180 L 180 60 Z" fill="url(#canMetal)" />

                            {/* Borda Superior do Metal */}
                            <ellipse cx="100" cy="60" rx="80" ry="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />

                            {/* TINTA (A parte mágica que muda de cor) */}
                            <ellipse
                                cx="100"
                                cy="60"
                                rx="70"
                                ry="16"
                                fill={color}
                                className="transition-colors duration-300 ease-in-out"
                            />

                            {/* Rótulo Quimex (Faixa Verde) */}
                            <path
                                d="M 21 90 C 21 90, 100 110, 179 90 L 179 150 C 179 150, 100 170, 21 150 Z"
                                fill="#117540"
                            />

                            {/* Logo Quimex sobre o rótulo (SVG interno) */}
                            <g transform="translate(45, 100)">
                                {/* Ícone Hexagono + Flask */}
                                <Hexagon size={40} color="white" strokeWidth={2.5} className="ml-1" />
                                <FlaskConical size={20} color="white" x={11} y={10} strokeWidth={2.5} />

                                {/* Texto Quimex */}
                                <text x="50" y="28" fontFamily="sans-serif" fontWeight="bold" fontSize="24" fill="white">
                                    Quimex
                                </text>
                            </g>

                            {/* Alça do balde (frente - conectores) */}
                            <circle cx="20" cy="65" r="3" fill="#6b7280" />
                            <circle cx="180" cy="65" r="3" fill="#6b7280" />
                        </svg>
                    </div>
                </div>

                {/* CARD 2: Color Picker (Controles) */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Seletor de Cor</h2>
                        <p className="text-sm text-gray-500">Ajuste os valores RGB ou use o seletor visual.</p>
                    </div>

                    <div className="p-8 flex flex-col gap-8 flex-1">

                        {/* Seletor Visual e Hex */}
                        <div className="flex gap-4 items-center">
                            <div className="relative group cursor-pointer">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={handleHexChange}
                                    className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                                />
                                <div
                                    className="w-20 h-20 rounded-lg border-2 border-gray-200 shadow-inner"
                                    style={{ backgroundColor: color }}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Código Hex</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="relative w-full">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">#</span>
                                        <input
                                            type="text"
                                            value={color.replace('#', '').toUpperCase()}
                                            readOnly
                                            className="w-full pl-7 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                                        title="Copiar cor"
                                    >
                                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Inputs RGB */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700 block mb-2">Composição RGB</label>

                            {/* Slider Vermelho */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Red (R)</span>
                                    <span>{rgb.r}</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="range" min="0" max="255"
                                        value={rgb.r}
                                        onChange={(e) => handleRgbChange('r', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                    <input
                                        type="number" min="0" max="255"
                                        value={rgb.r}
                                        onChange={(e) => handleRgbChange('r', e.target.value)}
                                        className="w-16 p-1 text-center border border-gray-200 rounded text-sm"
                                    />
                                </div>
                            </div>

                            {/* Slider Verde */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Green (G)</span>
                                    <span>{rgb.g}</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="range" min="0" max="255"
                                        value={rgb.g}
                                        onChange={(e) => handleRgbChange('g', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                    <input
                                        type="number" min="0" max="255"
                                        value={rgb.g}
                                        onChange={(e) => handleRgbChange('g', e.target.value)}
                                        className="w-16 p-1 text-center border border-gray-200 rounded text-sm"
                                    />
                                </div>
                            </div>

                            {/* Slider Azul */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Blue (B)</span>
                                    <span>{rgb.b}</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="range" min="0" max="255"
                                        value={rgb.b}
                                        onChange={(e) => handleRgbChange('b', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <input
                                        type="number" min="0" max="255"
                                        value={rgb.b}
                                        onChange={(e) => handleRgbChange('b', e.target.value)}
                                        className="w-16 p-1 text-center border border-gray-200 rounded text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}