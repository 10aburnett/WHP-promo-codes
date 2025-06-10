'use client';

import React, { useState, useEffect } from 'react';

interface CopyCodeButtonProps {
  code: string;
  size?: 'default' | 'large';
  whopId?: string;
  promoCodeId?: string;
  showUsageCount?: boolean;
  isSticky?: boolean;
}

export default function CopyCodeButton({ 
  code, 
  size = 'default', 
  whopId, 
  promoCodeId,
  showUsageCount = false,
  isSticky = false
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const displayCode = size === 'large' ? code : (code.length > 10 ? `${code.slice(0, 10)}..` : code);

  // Fetch usage count if needed
  useEffect(() => {
    if (showUsageCount && promoCodeId) {
      fetchUsageCount();
    }
  }, [showUsageCount, promoCodeId]);

  const fetchUsageCount = async () => {
    if (!promoCodeId) return;
    
    try {
      const response = await fetch(`/api/tracking?bonusId=${promoCodeId}`);
      if (response.ok) {
        const data = await response.json();
        setUsageCount(data.usageCount);
      }
    } catch (error) {
      console.error("Error fetching usage count:", error);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      
      // Track the copy event
      if (whopId && promoCodeId) {
        await trackCopyCode();
      }
      
      setTimeout(() => setCopied(false), 2000);
      
      // Refresh usage count after copy
      if (showUsageCount) {
        setTimeout(() => {
          fetchUsageCount();
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const trackCopyCode = async () => {
    try {
      const trackingData = JSON.stringify({
        casinoId: whopId, // Using whopId as casinoId for API compatibility
        bonusId: promoCodeId, // Using promoCodeId as bonusId for API compatibility
        actionType: 'code_copy',
      });
      
      // Use sendBeacon API if available for better reliability when page unloads
      if (navigator.sendBeacon) {
        const blob = new Blob([trackingData], { type: 'application/json' });
        const success = navigator.sendBeacon('/api/tracking', blob);
        
        if (success) return;
      }
      
      // Fall back to fetch if sendBeacon is not available or failed
      await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: trackingData,
      });
    } catch (error) {
      console.error("Error tracking code copy:", error);
    }
  };

  // Use different background color for sticky CTA only
  const bgColor = isSticky ? "bg-[#3e4050]" : "bg-[#2c2f3a]";
  const hoverBgColor = isSticky ? "hover:bg-[#4a4c5c]" : "hover:bg-[#343747]";

  // Different button classes based on size and sticky status
  const buttonClasses = size === 'large'
    ? `${bgColor} text-white rounded-lg ${hoverBgColor} hover:shadow-lg border border-transparent hover:border-[#68D08B] transition-all duration-200 px-4 py-3 w-full flex items-center justify-center relative group`
    : `${bgColor} text-white rounded-lg ${hoverBgColor} hover:shadow-lg border border-transparent hover:border-[#68D08B] transition-all duration-200 ${isSticky ? 'px-4 py-2 md:py-2.5 w-full md:w-auto' : 'px-3 py-2'} flex items-center justify-between relative ${isSticky ? 'min-w-[130px] h-[38px] md:h-[44px]' : 'min-w-[100px]'} group`;

  return (
    <div className="relative w-full">
      <button
        onClick={handleCopy}
        className={buttonClasses}
        title={code}
      >
        <div className={`text-center ${size !== 'large' ? 'flex-1 mr-2' : ''}`}>
          <span className={size === 'large' 
            ? 'text-xl md:text-2xl font-medium text-white' 
            : `text-sm md:text-base font-medium text-white ${isSticky ? 'text-base md:text-lg' : ''}`}>
            {copied ? 'Copied!' : displayCode}
          </span>
        </div>
        <div className={`${size === 'large' ? 'absolute right-3' : 'ml-2'} flex flex-col items-center ${isSticky ? 'min-w-[30px]' : ''}`}>
          {copied ? (
            <svg className="w-4 h-4 text-[#68D08B]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 group-hover:text-[#68D08B] transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          )}
          {showUsageCount && usageCount !== null && (
            <span className="text-xs text-gray-400 mt-1">{usageCount}</span>
          )}
        </div>
      </button>
    </div>
  );
} 