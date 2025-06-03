// src/components/CycleInfo.tsx

import { Repeat, AlertCircle, CheckCircle } from 'lucide-react';
import { useGlobalStore } from '../store/globalstore';
import { useMemo } from 'react';

const CycleInfo = () => {
  const cycleStatus = useGlobalStore((state) => state.cycleStatus);
  const segmentInfo = useGlobalStore((state) => state.segmentInfo);
  const obstacleStatus = useGlobalStore((state) => state.obstacleStatus);

  // ✅ SAFELY compute derived value in component (not inside selector)
  const isMoving = useMemo(() => cycleStatus === 'MOVING', [cycleStatus]);

  return (
    <div className="p-4 bg-white rounded-xl shadow animate-fade-in space-y-2 border border-gray-100">
      <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
        <Repeat className="w-5 h-5" /> Cycle Info
      </h3>
      <p>{cycleStatus ? `Current Cycle: ${cycleStatus}` : "Cycle information not available. Please check the system."}</p>
      <p>{segmentInfo ? `Current Segment: ${segmentInfo}` : "Segment information will appear once movement is initiated."}</p>
      <p className="flex items-center gap-1">
        {obstacleStatus === 'detected' ? (
          <>
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-600">Obstacle detected</span>
          </>
        ) : obstacleStatus === 'clear' ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-600">No obstacles</span>
          </>
        ) : (
          <span className="text-gray-500">Awaiting obstacle data...</span>
        )}
      </p>
      <p>The coop is currently {isMoving ? 'moving' : 'stationary'}. If it's not moving, check if the system is paused or facing an issue.</p>
    </div>
  );
};

export default CycleInfo;