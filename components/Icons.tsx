
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-full h-full"
  >
    {children}
  </svg>
);

export const CIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">C</text>
    </IconWrapper>
);

export const PythonIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">Py</text>
    </IconWrapper>
);

export const JavaIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">Java</text>
    </IconWrapper>
);

export const CSharpIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="bold" fill="currentColor">C#</text>
    </IconWrapper>
);

export const KotlinIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">Kotlin</text>
    </IconWrapper>
);

export const JavaScriptIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">JS</text>
    </IconWrapper>
);

export const NodeJsIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">Node</text>
    </IconWrapper>
);

export const ReactIcon = () => (
    <IconWrapper>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(120 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="8" />
        <circle cx="12" cy="12" r="2" />
    </IconWrapper>
);

export const MySqlIcon = () => (
    <IconWrapper>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">MySQL</text>
    </IconWrapper>
);
