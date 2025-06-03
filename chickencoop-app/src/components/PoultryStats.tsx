// src/components/PoultryStats.tsx

import { useEffect, useState } from 'react';
import { Egg, HeartPulse, AlertTriangle, CheckCircle, Bird } from 'lucide-react';
import { api } from '../api/api';

interface CoopStats {
  birdCount: number;
  eggCount: number;
  ailingBirdCount: number;
}

const PoultryStats = () => {
  const [stats, setStats] = useState<CoopStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestCoopStats = async () => {
      try {
        const res = await api.getCoopStatsHistory(); // Fetch full history
        const history: CoopStats[] = res.data;

        if (Array.isArray(history) && history.length > 0) {
          // Assuming history is sorted DESC (latest first). If not, sort by timestamp
          const latestEntry = history[0]; // Get the most recent entry
          setStats(latestEntry);
        } else {
          setError('No poultry stats found. Please log in data for your SmartCoop in the Inventory and Sales Page or check your data source.');
        }
      } catch (err) {
        console.error('❌ Failed to fetch poultry stats:', err);
        setError('Failed to load the latest data. Check your connection or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCoopStats();
  }, []);

  const birdCount = stats?.birdCount ?? 0;
  const eggCount = stats?.eggCount ?? 0;
  const ailingBirdCount = stats?.ailingBirdCount ?? 0;

  const ailingPercent = birdCount ? (ailingBirdCount / birdCount) * 100 : 0;
  const flockOk = ailingPercent < 10;

  return (
    <div className="p-4 bg-white rounded-xl shadow animate-fade-in border border-gray-100 space-y-2">
      <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
        <HeartPulse className="w-5 h-5" /> Current Poultry Stats
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading latest SmartCoop data. Please be patient.</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <p className="flex items-center gap-2">
            <Bird className="w-4 h-4 text-blue-600" />
            Poultry Total: <span className="font-medium">{birdCount}</span>
          </p>

          <p className="flex items-center gap-2">
            <Egg className="w-4 h-4 text-yellow-600" />
            Total Eggs: <span className="font-medium">{eggCount}</span>
          </p>

          <p className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-pink-600" />
            Infected Poultry: <span className="font-medium">{ailingBirdCount}</span>
          </p>

          {flockOk ? (
            <p className="text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Your flock is healthy. Sick birds are within acceptable limits.
            </p>
          ) : (
            <p className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> The flock is in DANGER. Sick bird count is high. ISOLATION IS RECOMMENDED!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PoultryStats;