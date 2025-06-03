import React, { useState } from 'react';
import { useGlobalStore, useSafeFieldSettings } from '../store/globalstore';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Settings,
  SlidersHorizontal,
  Utensils,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { api } from '../api/api';

const ControlSetupPage = () => {
  const { mode, fieldLength, fieldWidth, motorSpeed, lastManualCommand, feederCommand } =
    useSafeFieldSettings();

  const { setMode, setField, setManualCommand, setFeederCommand } = useGlobalStore((state) => ({
    setMode: state.setMode,
    setField: state.setField,
    setManualCommand: state.setManualCommand,
    setFeederCommand: state.setFeederCommand,
  }));

  const [tempFieldLength, setTempFieldLength] = useState<number>(fieldLength ?? 0);
  const [tempFieldWidth, setTempFieldWidth] = useState<number>(fieldWidth ?? 0);
  const [tempMotorSpeedPercent, setTempMotorSpeedPercent] = useState<number>(
    motorSpeed != null ? Math.round((motorSpeed / 255) * 100) : 0
  );

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (n: number) => void
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(Number(value));
    }
  };

  const handleManualCommand = async (
    command: 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT' | 'STOP'
  ) => {
    if (command !== lastManualCommand) {
      setManualCommand(command);
      try {
        await api.manualControl({ command });
        console.log(`Manual command ${command} sent`);
      } catch (err) {
        console.error('Failed to send manual command:', err);
      }
    }
  };

  const handleFeederToggle = async () => {
    const newCommand = feederCommand === 'ON' ? 'OFF' : 'ON';
    if (newCommand !== feederCommand) {
      setFeederCommand(newCommand);
      try {
        await api.feederControl({ feederCommand: newCommand });
        console.log(`Feeder command ${newCommand} sent`);
      } catch (err) {
        console.error('Failed to send feeder command:', err);
      }
    }
  };

  const handleSetFieldParams = async () => {
    const pwmSpeed = Math.round((tempMotorSpeedPercent / 100) * 255);
    setField(tempFieldLength, tempFieldWidth, pwmSpeed);
    try {
      await api.setField({
        fieldLength: tempFieldLength,
        fieldWidth: tempFieldWidth,
        motorSpeed: pwmSpeed,
      });
      console.log('Field parameters sent:', {
        fieldLength: tempFieldLength,
        fieldWidth: tempFieldWidth,
        motorSpeed: pwmSpeed,
      });
    } catch (err) {
      console.error('Failed to send field parameters:', err);
    }
  };

  const handleResetFieldParams = () => {
    setTempFieldLength(0);
    setTempFieldWidth(0);
    setTempMotorSpeedPercent(0);
    setField(0, 0, 0);
  };

  const handleSetMode = async (newMode: 'AUTO' | 'MANUAL') => {
    if (newMode !== mode) {
      setMode(newMode);
      try {
        await api.setMode({ mode: newMode });
        console.log(`Mode ${newMode} sent`);
      } catch (err) {
        console.error('Failed to send mode:', err);
      }
    }
  };

  const renderManualButton = (
    command: 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT' | 'STOP',
    icon: React.ReactNode,
    label: string,
    colorClass: string
  ) => {
    const isActive = lastManualCommand === command;
    return (
      <button
        onClick={() => handleManualCommand(command)}
        aria-label={label}
        className={`p-3 rounded-full transition ${
          isActive ? `${colorClass} ring-2 ring-offset-2 ring-blue-400` : `${colorClass} hover:brightness-110`
        } text-white`}
        title={label}
      >
        {icon}
      </button>
    );
  };

  const isFieldParamsValid =
    tempFieldLength > 0 && tempFieldWidth > 0 && tempMotorSpeedPercent > 0;

  const fieldSet = fieldLength > 0 && fieldWidth > 0 && motorSpeed > 0;

  return (
    <div className="relative min-h-screen w-full bg-center bg-cover bg-no-repeat bg-fixed bg-dashboard pt-[87px] overscroll-none">
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-black/0 to-black/0" />
      <div className="relative z-10 max-w-5xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Coop Control Setup
        </h1>

        {/* === Feeder Control === */}
        <div className="p-6 rounded-xl backdrop-blur bg-white/40 border border-white/20 shadow hover:shadow-2xl transition-all space-y-3">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Feeder Control
          </h3>
          <p className="font-semibold text-gray-700 mb-2">
            The feeder has been turned <span className="font-semibold">{feederCommand ?? 'Unknown'}</span>
          </p>
          <button
            className={`px-4 py-2 rounded-lg text-white transition ${
              feederCommand === 'ON' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
            onClick={handleFeederToggle}
          >
            Turn Feeder {feederCommand === 'ON' ? 'OFF' : 'ON'}
          </button>
        </div>

        {/* === Field Setup === */}
        <div className="p-6 rounded-xl backdrop-blur bg-white/40 border border-white/20 shadow hover:shadow-2xl transition-all space-y-4">
          <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Field Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="fieldLength" className="block text-sm font-semibold text-gray-700">
                Field Length (m)
              </label>
              <input
                type="text"
                id="fieldLength"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter length"
                title="Field length in meters"
                className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                value={tempFieldLength}
                onChange={(e) => handleNumericInput(e, setTempFieldLength)}
              />
            </div>

            <div>
              <label htmlFor="fieldWidth" className="block text-sm font-semibold text-gray-700">
                Field Width (m)
              </label>
              <input
                type="text"
                id="fieldWidth"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter width"
                title="Field width in meters"
                className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                value={tempFieldWidth}
                onChange={(e) => handleNumericInput(e, setTempFieldWidth)}
              />
            </div>

            <div>
              <label htmlFor="motorSpeed" className="block text-sm font-semibold text-gray-700">
                Motor Speed (%)
              </label>
              <input
                type="range"
                id="motorSpeed"
                title="Set the motor speed as a percentage"
                min="0"
                max="100"
                value={tempMotorSpeedPercent}
                onChange={(e) => setTempMotorSpeedPercent(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="text-sm text-gray-600 mt-1 text-center">
                {tempMotorSpeedPercent}%
              </div>
            </div>
          </div>

          {fieldSet && (
            <div className="p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              You have set the field length to <strong>{fieldLength}m</strong>, width to <strong>{fieldWidth}m</strong>,
              and motor speed to <strong>{Math.round((motorSpeed / 255) * 100)}%</strong>. Proceed to select your preferred mode of Operation.
            </div>
          )}

          <div className="flex gap-4 mt-3">
            <button
              className={`px-4 py-2 rounded-lg font-semibold text-white transition flex-1 ${
                isFieldParamsValid && !fieldSet
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleSetFieldParams}
              disabled={!isFieldParamsValid || fieldSet}
            >
              Set Field Parameters
            </button>

            {fieldSet && (
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition flex-1"
                onClick={handleResetFieldParams}
              >
                <RefreshCw className="inline-block mr-2 w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* === Mode Selection === */}
        <div className="p-6 rounded-xl backdrop-blur bg-white/40 border border-white/20 shadow hover:shadow-2xl transition-all space-y-3">
          <h3 className="text-lg font-bold text-purple-600 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Operation Mode
          </h3>
          <p className="font-semibold text-gray-700 mb-2">
            Current mode: <span className="font-bold">{mode ?? 'You have not chosen a mode yet'}</span>
          </p>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg text-white transition flex-1 ${
                mode === 'AUTO' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={() => handleSetMode('AUTO')}
            >
              AUTO
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-white transition flex-1 ${
                mode === 'MANUAL' ? 'bg-yellow-500 ring-2 ring-yellow-400' : 'bg-yellow-400 hover:bg-yellow-500'
              }`}
              onClick={() => handleSetMode('MANUAL')}
            >
              MANUAL
            </button>
          </div>
        </div>

        {/* === Manual Controls === */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            mode === 'MANUAL' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6 mt-0 rounded-xl backdrop-blur bg-white/40 border border-white/20 shadow hover:shadow-2xl transition-all space-y-4">
            <h3 className="text-lg font-bold text-pink-500 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Manual Controls
            </h3>
            <p className="text-gray-700 mb-2">
              Last command: <span className="font-semibold">{lastManualCommand ?? 'No command sent'}</span>
            </p>

            <div className="flex flex-col items-center gap-2">
              {renderManualButton('FORWARD', <ArrowUp className="w-6 h-6" />, 'Move Forward', 'bg-blue-600')}
              <div className="flex items-center gap-4">
                {renderManualButton('LEFT', <ArrowLeft className="w-6 h-6" />, 'Turn Left', 'bg-blue-600')}
                {renderManualButton('STOP', <Square className="w-6 h-6" />, 'Stop', 'bg-red-600')}
                {renderManualButton('RIGHT', <ArrowRight className="w-6 h-6" />, 'Turn Right', 'bg-blue-600')}
              </div>
              {renderManualButton('BACKWARD', <ArrowDown className="w-6 h-6" />, 'Move Backward', 'bg-blue-600')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlSetupPage;