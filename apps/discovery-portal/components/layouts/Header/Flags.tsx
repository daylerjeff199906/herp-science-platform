import React from 'react';

export const FlagPE = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className}>
        <circle cx="16" cy="16" r="16" fill="#D91023" />
        <rect x="10.6" y="0" width="10.8" height="32" fill="#FFFFFF" clipPath="circle(16px at 16px 16px)" />
    </svg>
);

export const FlagUS = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className}>
        <circle cx="16" cy="16" r="16" fill="#0A3161" />
        <g clipPath="circle(16px at 16px 16px)">
            <path d="M0 0h32v32H0z" fill="#B22234" />
            <path d="M0 4h32v4H0zm0 8h32v4H0zm0 8h32v4H0zm0 8h32v4H0z" fill="#FFF" />
            <path d="M0 0h16v16H0z" fill="#3C3B6E" />
        </g>
    </svg>
);

export const FlagBR = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className}>
        <circle cx="16" cy="16" r="16" fill="#009C3B" />
        <path d="M16 4.5L27 16 16 27.5 5 16z" fill="#FFDF00" clipPath="circle(16px at 16px 16px)" />
        <circle cx="16" cy="16" r="7.5" fill="#002776" />
        <path d="M10 16a8 8 0 0112 0" fill="none" stroke="#FFF" strokeWidth="1" transform="rotate(-15 16 16)" />
    </svg>
);
