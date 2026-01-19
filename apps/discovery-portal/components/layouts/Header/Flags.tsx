import React from 'react';

export const FlagPE = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect width="32" height="32" rx="16" fill="#D91023" />
        <path d="M10 0h12v32H10z" fill="#FFFFFF" />
    </svg>
);

export const FlagUS = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect width="32" height="32" rx="16" fill="#B22234" />
        <path d="M0 4h32v4H0zm0 8h32v4H0zm0 8h32v4H0zm0 8h32v4H0z" fill="#FFFFFF" />
        <path d="M0 0h16v16H0z" fill="#3C3B6E" />
        {/* Simplified stars pattern */}
        <g fill="#FFFFFF" opacity="0.9">
            <circle cx="2" cy="2" r="0.8" />
            <circle cx="5" cy="2" r="0.8" />
            <circle cx="8" cy="2" r="0.8" />
            <circle cx="11" cy="2" r="0.8" />
            <circle cx="14" cy="2" r="0.8" />

            <circle cx="3.5" cy="5" r="0.8" />
            <circle cx="6.5" cy="5" r="0.8" />
            <circle cx="9.5" cy="5" r="0.8" />
            <circle cx="12.5" cy="5" r="0.8" />

            <circle cx="2" cy="8" r="0.8" />
            <circle cx="5" cy="8" r="0.8" />
            <circle cx="8" cy="8" r="0.8" />
            <circle cx="11" cy="8" r="0.8" />
            <circle cx="14" cy="8" r="0.8" />

            <circle cx="3.5" cy="11" r="0.8" />
            <circle cx="6.5" cy="11" r="0.8" />
            <circle cx="9.5" cy="11" r="0.8" />
            <circle cx="12.5" cy="11" r="0.8" />

            <circle cx="2" cy="14" r="0.8" />
            <circle cx="5" cy="14" r="0.8" />
            <circle cx="8" cy="14" r="0.8" />
            <circle cx="11" cy="14" r="0.8" />
            <circle cx="14" cy="14" r="0.8" />
        </g>
    </svg>
);

export const FlagBR = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect width="32" height="32" rx="16" fill="#009C3B" />
        <path d="M16 4.5L27 16 16 27.5 5 16z" fill="#FFDF00" />
        <circle cx="16" cy="16" r="6" fill="#002776" />
        <path d="M11 16a8 8 0 0110 0" fill="none" stroke="#FFFFFF" strokeWidth="0.8" transform="rotate(-15 16 16)" />
    </svg>
);
