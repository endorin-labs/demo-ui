// Use portal pattern to render the tooltip at the root level
import { IconShieldLock } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const EnclaveShield = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Placeholder PCR values for the enclave
  const PLACEHOLDER_PCR_VALUES = {
    PCR0: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    PCR1: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    PCR2: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    PCR8: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  // Position calculation
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showTooltip && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [showTooltip]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showTooltip) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      // Small delay to avoid immediate closing
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <>
      <div className="relative" ref={buttonRef}>
        <div
          className="flex items-center justify-center cursor-pointer p-2 hover:bg-gray-200/10 rounded-full transition-colors"
          onClick={handleClick}
        >
          <IconShieldLock size={24} className="text-green-500" />
        </div>
      </div>

      {showTooltip &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed z-[9999] w-96 bg-gray-800 border border-gray-700 text-white p-4 rounded-lg shadow-xl"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: 'translateX(-50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Speech bubble arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800"></div>

            <h3 className="text-lg font-semibold mb-2 text-green-400">
              Secure Nitro Enclave
            </h3>
            <p className="text-sm mb-3 leading-relaxed">
              This application is running in an AWS Nitro Enclave with the
              following PCR values:
            </p>

            <div className="font-mono text-xs bg-gray-900/50 p-3 rounded-md">
              {Object.entries(PLACEHOLDER_PCR_VALUES).map(([key, value]) => (
                <div key={key} className="flex flex-col mb-4 last:mb-0">
                  <span className="font-semibold text-green-400 mb-1">
                    {key}:
                  </span>
                  <span className="break-all text-gray-300 pl-2 border-l-2 border-green-500/30">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs text-gray-400 pt-2 border-t border-gray-700">
              PCR values uniquely identify this enclave&apos;s code and
              configuration, ensuring secure execution.
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
