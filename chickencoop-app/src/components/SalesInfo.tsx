// src/components/SalesInfo.tsx

import { useEffect, useState, useMemo } from 'react';
import { Egg, DollarSign, Bird } from 'lucide-react';
import { api } from '../api/api';

interface SalesStats {
  birdsSold: number;
  eggsSold: number;
}

const SalesInfo = () => {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const birdPrice = 1200; // KES 1200 per bird
  const eggPrice = 15;    // KES 15 per egg

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const res = await api.getSalesLogHistory(true); // Assumes your backend returns totals here
        // Expected res.data = { birdsSold: total, eggsSold: total }
        setStats(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch sales stats:', err);
        setError('Failed to load sales data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesStats();
  }, []);

  const birdsSold = stats?.birdsSold ?? 0;
  const eggsSold = stats?.eggsSold ?? 0;

  const totalRevenue = useMemo(() => {
    return (birdsSold * birdPrice) + (eggsSold * eggPrice);
  }, [birdsSold, eggsSold]);

  const hasData = useMemo(() => birdsSold > 0 || eggsSold > 0, [birdsSold, eggsSold]);

  return (
    <div className="p-4 bg-white rounded-xl shadow animate-fade-in space-y-3 border border-gray-100">
      <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
        <DollarSign className="w-5 h-5" /> Sales Overview
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading the latest sales data. Please be patient.</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : hasData ? (
        <>
          <p className="flex items-center gap-2 text-gray-700">
            <Bird className="w-5 h-5 text-yellow-600" />
            {birdsSold} birds sold
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <Egg className="w-5 h-5 text-pink-600" />
            {eggsSold} eggs sold
          </p>

          <div className="text-2xl font-bold text-green-800 text-center mt-2">
            KES {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-gray-600 text-center">Total revenue</p>
        </>
      ) : (
        <p className="text-gray-600 text-center text-sm italic py-6">
          No sales data available yet. Sales will appear here once recorded.
        </p>
      )}
    </div>
  );
};

export default SalesInfo;