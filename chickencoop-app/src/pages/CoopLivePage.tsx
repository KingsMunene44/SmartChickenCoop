// src/pages/CoopLivePage.tsx

import React, { useEffect } from 'react';
import { useGlobalStore } from '../store/globalstore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { CheckCircle, AlertCircle, Thermometer, Activity } from 'lucide-react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const CoopLivePage = () => {
  const temperature = useGlobalStore((state) => state.temperature);
  const fanStatus = useGlobalStore((state) => state.fanStatus);
  const feederStatus = useGlobalStore((state) => state.feederStatus);
  const cycleStatus = useGlobalStore((state) => state.cycleStatus);
  const segmentInfo = useGlobalStore((state) => state.segmentInfo);
  const obstacleStatus = useGlobalStore((state) => state.obstacleStatus);

  const [chartData, setChartData] = React.useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      pointRadius: number;
      pointHoverRadius: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
    },
    scales: {
      x: {
        title: { display: true, text: 'Time' },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: { display: true, text: 'Temperature (°C)' },
        suggestedMin: 0,
        suggestedMax: 50,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
          weight: 'normal' as const,
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (temperature !== null) {
        setChartData((prevData) => {
          const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
          const newData = [...prevData.datasets[0].data, temperature];

          if (newLabels.length > 30) {
            newLabels.shift();
            newData.shift();
          }

          return {
            labels: newLabels,
            datasets: [
              {
                ...prevData.datasets[0],
                data: newData,
              },
            ],
          };
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [temperature]);

  return (
    <div className="relative min-h-screen w-full bg-center bg-cover bg-no-repeat bg-fixed bg-dashboard pt-[75px] overscroll-none">
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-black/0 to-black/0" />

      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-4">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="p-6 rounded-xl border border-white/30 bg-white/30 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-bold text-green-600 flex items-center gap-2">
              <Thermometer className="w-6 h-6" />
              Temperature & System Status
            </h3>
            <p className="mt-2">
              {temperature !== null ? `${temperature}°C` : 'No temperature readings available.'}
            </p>
            <p className="flex items-center gap-1 mt-1">
              {fanStatus === 'on' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              Fan: {fanStatus || 'Fan status unknown. Fan readings might be offline.'}
            </p>
            <p className="flex items-center gap-1 mt-1">
              {feederStatus === 'on' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              Feeder: {feederStatus || 'Feeder status unknown. Control readings might be offline.'}
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl border border-white/30 bg-white/30 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Cycle & Movement Status
            </h3>
            <p className="mt-2">{cycleStatus || 'Cycle status unavailable.'}</p>
            <p className="mt-1">{segmentInfo || 'Segment info unavailable.'}</p>
            <p className="flex items-center gap-1 mt-1">
              {obstacleStatus === 'detected' ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              Obstacle: {obstacleStatus || 'No data.'}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 rounded-xl border border-white/30 bg-white/30 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden">
          <h3 className="text-lg font-bold text-blue-600 mb-2">Temperature Chart (Last 30 Readings)</h3>
          <div className="relative h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoopLivePage;