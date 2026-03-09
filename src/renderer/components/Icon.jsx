import React from 'react';

const Icon = ({ d, size = 18, strokeWidth = 2, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
        strokeLinejoin="round" className={className}>
        <path d={d} />
    </svg>
);

export default Icon;
