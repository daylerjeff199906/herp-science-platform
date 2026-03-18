'use client';

import React from 'react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    className?: string;
}

export function EmptyState({
    title = "La caja está vacía",
    description = "Aún no hay elementos por aquí.",
    className = ""
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center p-6 antialiased ${className}`}>
            {/* Tarjeta de Estado Vacío */}
            <div className="bg-background rounded-3xl shadow-sm w-full max-w-sm p-10 flex flex-col items-center justify-center gap-6 transition-colors duration-300">

                {/* Estilos de animación embebidos */}
                <style jsx>
                    {`
            .float-main {
                animation: float 4s ease-in-out infinite;
                transform-origin: 50% 12%;
            }
            .float-delay-1 {
                animation: float-alt 4.5s ease-in-out infinite 0.5s;
                transform-origin: center;
            }
            .float-delay-2 {
                animation: float 5s ease-in-out infinite 1.2s;
                transform-origin: center;
            }
            .shadow-pulse {
                animation: pulse-shadow 4s ease-in-out infinite;
                transform-origin: 50px 86px;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            @keyframes float-alt {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-6px) rotate(15deg); }
            }
            @keyframes pulse-shadow {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(0.85); opacity: 0.6; }
            }
          `}
                </style>

                {/* Contenedor de la Animación SVG */}
                <div className="w-48 h-48 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                        {/* Sombra base */}
                        <ellipse
                            cx="50" cy="92" rx="35" ry="5"
                            className="shadow-pulse fill-slate-200 dark:fill-slate-900/60 transition-colors duration-300"
                        />

                        {/* FORMAS TRASERAS (Solapas posteriores) */}
                        <path d="M 50 31 L 25 43 L 10 33 L 35 21 Z" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600 transition-colors duration-300" strokeWidth="2.5" strokeLinejoin="round" />
                        <path d="M 50 31 L 75 43 L 90 33 L 65 21 Z" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600 transition-colors duration-300" strokeWidth="2.5" strokeLinejoin="round" />

                        {/* CUERPO PRINCIPAL DE LA CAJA (Caras laterales) */}
                        <path d="M 25 43 L 50 55 L 50 85 L 25 73 Z" className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600 transition-colors duration-300" strokeWidth="2.5" strokeLinejoin="round" />
                        <path d="M 50 55 L 75 43 L 75 73 L 50 85 Z" className="fill-slate-100 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600 transition-colors duration-300" strokeWidth="2.5" strokeLinejoin="round" />

                        {/* HUECO INTERIOR (La profundidad de la caja vacía) */}
                        <path d="M 50 31 L 25 43 L 50 55 L 75 43 Z" className="fill-slate-200 dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-600 transition-colors duration-300" strokeWidth="2.5" strokeLinejoin="round" />

                        {/* FORMAS FRONTALES (Solapas delanteras) */}
                        <path d="M 25 43 L 50 55 L 35 65 L 10 53 Z" className="fill-white dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600 transition-colors duration-300" strokeWidth="2.5" strokeLinejoin="round" />
                        <path d="M 50 55 L 75 43 L 90 53 L 65 65 Z" className="fill-slate-50 dark:fill-slate-600 stroke-slate-300 dark:stroke-slate-600 transition-colors duration-300" strokeWidth="2.5" strokeLinejoin="round" />

                        {/* ELEMENTOS FLOTANTES */}
                        <g className="float-delay-2 stroke-slate-400 dark:stroke-slate-500 transition-colors duration-300">
                            <line x1="78" y1="13" x2="84" y2="13" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="81" y1="10" x2="81" y2="16" strokeWidth="2.5" strokeLinecap="round" />
                        </g>

                        <circle
                            cx="20" cy="22" r="3" fill="none"
                            className="float-delay-1 stroke-slate-400 dark:stroke-slate-500 transition-colors duration-300"
                            strokeWidth="2.5"
                        />
                    </svg>
                </div>

                {/* Textos minimalistas adaptados */}
                <div className="text-center space-y-1 mt-2">
                    <h3 className="text-slate-800 dark:text-slate-100 font-medium text-lg transition-colors duration-300">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">{description}</p>
                </div>

            </div>
        </div>
    );
}
