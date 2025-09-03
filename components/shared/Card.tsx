
import React from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, icon, children }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md">
      <div className="px-4 py-3 sm:px-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                {icon && <span className="text-gray-400">{icon}</span>}
                 <div>
                    <h3 className="text-lg font-medium leading-6 text-white">{title}</h3>
                    {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-400">{subtitle}</p>}
                </div>
            </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};
