'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Track */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-indigo-500 dark:to-purple-600 transition-all duration-300 ease-in-out" />
      
      {/* Toggle Thumb */}
      <div
        className={`relative w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center ${
          isDark ? 'translate-x-3' : '-translate-x-3'
        }`}
      >
        {/* Sun Icon */}
        <svg
          className={`w-3 h-3 text-yellow-500 transition-all duration-300 ease-in-out ${
            isDark ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
        
        {/* Moon Icon */}
        <svg
          className={`absolute w-3 h-3 text-indigo-600 transition-all duration-300 ease-in-out ${
            isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </button>
  );
} 