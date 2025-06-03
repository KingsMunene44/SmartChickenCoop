// src/components/ModeInfo.tsx

import { Settings } from 'lucide-react';
import { useGlobalStore } from '../store/globalstore';

const ModeInfo = () => {
  const mode = useGlobalStore(state => state.mode);

  return (
    <div className="p-4 bg-white rounded-xl shadow animate-fade-in border border-gray-100">
      <h3 className="text-lg font-bold text-purple-600 flex items-center gap-2">
        <Settings className="w-5 h-5" /> Mode Info
      </h3>
      <p>
        {mode
          ? `The coop is on ${mode} mode and will ${
              mode === 'AUTO'
                ? 'automatically rotate on the field.'
                : 'require manual control.'
            }`
          : 'Mode not set. Please configure the mode in the Control Setup Page.'}
      </p>
    </div>
  );
};

export default ModeInfo;