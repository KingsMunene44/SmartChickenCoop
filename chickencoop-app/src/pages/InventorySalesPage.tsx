// src/pages/InventorySalesPage.tsx

import React, { useState, useEffect } from 'react';
import { BarChart2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useGlobalStore } from '../store/globalstore';
import { shallow } from 'zustand/shallow';
import { api } from '../api/api';
import '../styles/InventorySalesPage.css';

interface CoopStatsData {
  timestamp: number;
  birdCount: number;
  eggCount: number;
  ailingBirdCount: number;
}

interface SalesLogData {
  timestamp: number;
  eggsSold: number;
  birdsSold: number;
}

interface InputFieldProps {
  label: string;
  value: number | null;
  onChange: (val: number | null) => void;
  id: string;
  placeholderExample: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, id, placeholderExample }) => {
  const [inputValue, setInputValue] = useState<string>(value !== null ? String(value) : '');

  useEffect(() => {
    setInputValue(value !== null ? String(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val === '') {
      onChange(null);
    } else {
      const parsed = parseInt(val);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange(parsed);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        type="number"
        min={0}
        value={inputValue}
        onChange={handleChange}
        className="input-no-spinner mt-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none appearance-none"
        placeholder={`e.g., ${placeholderExample}`}
        title={`Enter ${label.toLowerCase()}`}
        onWheel={(e) => e.currentTarget.blur()}
      />
    </div>
  );
};

const InventorySalesPage = () => {
  const { setCoopStats, setSalesLog } = useGlobalStore(
    (state) => ({
      setCoopStats: state.setCoopStats,
      setSalesLog: state.setSalesLog,
    }),
    shallow
  );

  const [coopHistory, setCoopHistory] = useState<CoopStatsData[]>([]);
  const [salesHistory, setSalesHistory] = useState<SalesLogData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input states
  const [birdCountInput, setBirdCountInput] = useState<number | null>(null);
  const [eggCountInput, setEggCountInput] = useState<number | null>(null);
  const [ailingBirdCountInput, setAilingBirdCountInput] = useState<number | null>(null);
  const [eggsSoldInput, setEggsSoldInput] = useState<number | null>(null);
  const [birdsSoldInput, setBirdsSoldInput] = useState<number | null>(null);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    try {
      const coopStatsHistory = await api.getCoopStatsHistory();
      const salesLogHistory = await api.getSalesLogHistory();

      setCoopHistory(coopStatsHistory.data);
      setSalesHistory(salesLogHistory.data);
    } catch (err) {
      setError('Failed to fetch history data. Please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const isValid = [birdCountInput, eggCountInput, ailingBirdCountInput, eggsSoldInput, birdsSoldInput].every(
    (val) => val !== null && val >= 0
  );

  const handleSubmit = async () => {
    if (!isValid) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timestampNow = Date.now();

      await api.coopStats({
        birdCount: birdCountInput!,
        eggCount: eggCountInput!,
        ailingBirdCount: ailingBirdCountInput!,
      });

      await api.salesLog({
        birdsSold: birdsSoldInput!,
        eggsSold: eggsSoldInput!,
      });

      const newCoopEntry: CoopStatsData = {
        timestamp: timestampNow,
        birdCount: birdCountInput!,
        eggCount: eggCountInput!,
        ailingBirdCount: ailingBirdCountInput!,
      };

      const newSalesEntry: SalesLogData = {
        timestamp: timestampNow,
        birdsSold: birdsSoldInput!,
        eggsSold: eggsSoldInput!,
      };

      setCoopStats(birdCountInput!, eggCountInput!, ailingBirdCountInput!);
      setSalesLog(birdsSoldInput!, eggsSoldInput!);

      setCoopHistory([newCoopEntry, ...coopHistory]);
      setSalesHistory([newSalesEntry, ...salesHistory]);

      setBirdCountInput(null);
      setEggCountInput(null);
      setAilingBirdCountInput(null);
      setEggsSoldInput(null);
      setBirdsSoldInput(null);
    } catch (err) {
      setError('Failed to save snapshot. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-center bg-cover bg-no-repeat bg-fixed bg-dashboard pt-[87px] overscroll-none">
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-black/0 to-black/0" />

      <div className="relative z-10 max-w-6xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-600" />
          Inventory & Sales Tracking
        </h1>

        <div className="p-6 rounded-xl backdrop-blur bg-white/40 border border-white/20 shadow hover:shadow-2xl transition-all space-y-4">
          <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Entry for Poultry Records
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Bird Count" value={birdCountInput} onChange={setBirdCountInput} id="birdCount" placeholderExample="100" />
            <InputField label="Egg Count" value={eggCountInput} onChange={setEggCountInput} id="eggCount" placeholderExample="200" />
            <InputField label="Ailing Bird Count" value={ailingBirdCountInput} onChange={setAilingBirdCountInput} id="ailingBirdCount" placeholderExample="2" />
            <InputField label="Eggs Sold" value={eggsSoldInput} onChange={setEggsSoldInput} id="eggsSold" placeholderExample="50" />
            <InputField label="Birds Sold" value={birdsSoldInput} onChange={setBirdsSoldInput} id="birdsSold" placeholderExample="5" />
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <button
            disabled={!isValid || loading}
            className={`w-full mt-4 py-2 rounded-lg text-white transition ${isValid && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={handleSubmit}
          >
            {loading ? 'Saving...' : 'Save Snapshot'}
          </button>
        </div>

        {/* Historical Records — Two Tables Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl backdrop-blur bg-white/40 border border-white/20 shadow hover:shadow-2xl transition-all">
            <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4">
              Coop Stats History
            </h3>

            {coopHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-6">No coop stats records yet.</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full table-auto border-collapse text-sm rounded-lg overflow-hidden">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Timestamp</th>
                      <th className="px-4 py-2 text-left">Birds</th>
                      <th className="px-4 py-2 text-left">Eggs</th>
                      <th className="px-4 py-2 text-left">Ailing Birds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coopHistory.map((entry, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-800">{format(entry.timestamp, 'PPpp')}</td>
                        <td className="px-4 py-2">{entry.birdCount}</td>
                        <td className="px-4 py-2">{entry.eggCount}</td>
                        <td className="px-4 py-2">{entry.ailingBirdCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-6 rounded-xl backdrop-blur bg-white/40 border border-white/20 shadow hover:shadow-2xl transition-all">
            <h3 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-4">
              Sales History
            </h3>

            {salesHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-6">No sales records yet.</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full table-auto border-collapse text-sm rounded-lg overflow-hidden">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Timestamp</th>
                      <th className="px-4 py-2 text-left">Eggs Sold</th>
                      <th className="px-4 py-2 text-left">Birds Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesHistory.map((entry, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-800">{format(entry.timestamp, 'PPpp')}</td>
                        <td className="px-4 py-2">{entry.eggsSold}</td>
                        <td className="px-4 py-2">{entry.birdsSold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySalesPage;