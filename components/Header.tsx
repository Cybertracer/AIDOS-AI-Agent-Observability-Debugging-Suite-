
import React from 'react';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
        <path d="M12 12a2.5 2.5 0 0 0-2.5 2.5v0A2.5 2.5 0 0 0 12 17h0a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 12 12Z" />
        <path d="M4.5 12A2.5 2.5 0 0 1 7 14.5v0a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 2 14.5v0A2.5 2.5 0 0 1 4.5 12Z" />
        <path d="M19.5 12a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h0a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 19.5 12Z" />
        <path d="M12 4.5a2.5 2.5 0 0 0-2.5 2.5v0A2.5 2.5 0 0 0 12 9.5h0a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 12 4.5Z" />
        <path d="M7 4.5A2.5 2.5 0 0 0 4.5 7v0A2.5 2.5 0 0 0 7 9.5h0a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 7 4.5Z" />
        <path d="M17 4.5a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5h0a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 17 4.5Z" />
        <path d="M7 14.5a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5h0a2.5 2.5 0 0 0 2.5-2.5v0a2.5 2.5 0 0 0-2.5-2.5Z" />
        <path d="M17 14.5a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5h0a2.5 2.5 0 0 0 2.5-2.5v0a2.5 2.5 0 0 0-2.5-2.5Z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BrainIcon className="h-8 w-8 text-cyan-400"/>
            <h1 className="text-2xl font-bold text-white">AIDOS</h1>
            <span className="hidden sm:block text-sm text-gray-400 pt-1">
              AI Agent Observability & Debugging Suite
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
