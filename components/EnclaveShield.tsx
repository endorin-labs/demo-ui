import { IconShieldLock } from '@tabler/icons-react';
import { useState } from 'react';

// Placeholder PCR values for the enclave
const PLACEHOLDER_PCR_VALUES = {
  PCR0: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  PCR1: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
  PCR2: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
  PCR8: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
};

export const EnclaveShield = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <IconShieldLock size={24} className="text-green-500" />
      </div>

      {showTooltip && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
          <h3 className="text-lg font-semibold mb-2">Secure Nitro Enclave</h3>
          <p className="text-sm mb-3">
            This application is running in an AWS Nitro Enclave with the
            following PCR values:
          </p>

          <div className="space-y-2 font-mono text-xs">
            {Object.entries(PLACEHOLDER_PCR_VALUES).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="font-semibold text-green-400">{key}:</span>
                <span className="truncate text-gray-300">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-400">
            PCR values uniquely identify this enclave&apos;s code and
            configuration, ensuring secure execution.
          </div>
        </div>
      )}
    </div>
  );
};
