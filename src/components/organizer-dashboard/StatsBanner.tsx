import React from 'react';
import { X, Info } from 'lucide-react';

interface StatsBannerProps {
  status: 'pending' | 'unverified' | 'verified';
  onClose?: () => void;
  onAction?: () => void;
}

const StatsBanner: React.FC<StatsBannerProps> = ({ status, onClose, onAction }) => {
  // Hide banner if verified
  if (status === 'verified') return null;

  const isPending = status === 'pending';
  
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border mb-8 gap-4 ${
      isPending 
        ? 'bg-[#F0FDF4] border-[#86EFAC]' 
        : 'bg-[#FFFBEB] border-[#FDE68A]'
    }`}>
      
      {/* Left Side: Icon + Text */}
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full shrink-0 ${
          isPending ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF3C7] text-[#92400E]'
        }`}>
          <Info className="h-5 w-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className={`font-medium text-sm sm:text-base ${
              isPending ? 'text-[#166534]' : 'text-[#92400E]'
            }`}>
              {isPending ? 'Your account is under review' : 'Finish setting up your account'}
            </h3>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isPending 
                ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]' 
                : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
            }`}>
              {isPending ? 'PENDING' : 'UNVERIFIED'}
            </span>
          </div>
          <p className={`text-xs sm:text-sm ${
            isPending ? 'text-[#166534]/80' : 'text-[#92400E]/80'
          }`}>
            {isPending 
              ? 'We usually approve within a day. Free events can go live now, paid events unlock once you\'re verified.'
              : 'Add your bank details to publish paid events and receive payouts. Free events can go live without it.'
            }
          </p>
        </div>
      </div>

      {/* Right Side: Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
        <button 
          onClick={onAction}
          className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
        >
          {isPending ? 'View status' : 'Add bank details'}
        </button>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-white/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default StatsBanner;