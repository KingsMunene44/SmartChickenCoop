// src/store/globalstore.ts

import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

//Store Interface
interface GlobalStore {
  //Statuses from ESP
  temperature: number | null;
  fanStatus: string | null;
  feederStatus: string | null;
  cycleStatus: string | null;
  segmentInfo: string | null;
  obstacleStatus: string | null;

  //App Input Settings
  mode: 'AUTO' | 'MANUAL' | null;
  fieldLength: number | null;
  fieldWidth: number | null;
  motorSpeed: number | null;
  lastManualCommand: 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT' | 'STOP' | null;
  feederCommand: 'ON' | 'OFF' | null;

  birdCount: number | null;
  eggCount: number | null;
  ailingBirdCount: number | null;
  birdsSold: number | null;
  eggsSold: number | null;

  //Setters
  setTemperature: (temp: number) => void;
  setFanStatus: (status: string) => void;
  setFeederStatus: (status: string) => void;
  setCycleStatus: (status: string) => void;
  setSegmentInfo: (info: string) => void;
  setObstacleStatus: (status: string) => void;

  setMode: (mode: 'AUTO' | 'MANUAL') => void;
  setField: (length: number, width: number, speed: number) => void;
  setManualCommand: (cmd: 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT' | 'STOP') => void;
  setFeederCommand: (cmd: 'ON' | 'OFF') => void;

  setCoopStats: (birds: number, eggs: number, ailing: number) => void;
  setSalesLog: (birdsSold: number, eggsSold: number) => void;
}

//Store Implementation
export const useGlobalStore = createWithEqualityFn<GlobalStore>((set) => ({
//Statuses from ESP
  temperature: null,
  fanStatus: null,
  feederStatus: null,
  cycleStatus: null,
  segmentInfo: null,
  obstacleStatus: null,

  //App Input Settings 
  mode: null,
  fieldLength: null,
  fieldWidth: null,
  motorSpeed: null,
  lastManualCommand: null,
  feederCommand: null,

  birdCount: null,
  eggCount: null,
  ailingBirdCount: null,
  birdsSold: null,
  eggsSold: null,

  //Setters
  setTemperature: (temp) =>
    set((state) => (state.temperature !== temp ? { temperature: temp } : {})),

  setFanStatus: (status) =>
    set((state) => (state.fanStatus !== status ? { fanStatus: status } : {})),

  setFeederStatus: (status) =>
    set((state) => (state.feederStatus !== status ? { feederStatus: status } : {})),

  setCycleStatus: (status) =>
    set((state) => (state.cycleStatus !== status ? { cycleStatus: status } : {})),

  setSegmentInfo: (info) =>
    set((state) => (state.segmentInfo !== info ? { segmentInfo: info } : {})),

  setObstacleStatus: (status) =>
    set((state) => (state.obstacleStatus !== status ? { obstacleStatus: status } : {})),

  setMode: (mode) =>
    set((state) => (state.mode !== mode ? { mode } : {})),

  setField: (length, width, speed) =>
    set((state) =>
      state.fieldLength !== length || state.fieldWidth !== width || state.motorSpeed !== speed
        ? { fieldLength: length, fieldWidth: width, motorSpeed: speed }
        : {}
    ),

  setManualCommand: (cmd) =>
    set((state) => (state.lastManualCommand !== cmd ? { lastManualCommand: cmd } : {})),

  setFeederCommand: (cmd) =>
    set((state) => (state.feederCommand !== cmd ? { feederCommand: cmd } : {})),

  setCoopStats: (birds, eggs, ailing) =>
    set((state) =>
      state.birdCount !== birds || state.eggCount !== eggs || state.ailingBirdCount !== ailing
        ? { birdCount: birds, eggCount: eggs, ailingBirdCount: ailing }
        : {}
    ),

  setSalesLog: (birdsSold, eggsSold) =>
    set((state) =>
      state.birdsSold !== birdsSold || state.eggsSold !== eggsSold
        ? { birdsSold, eggsSold }
        : {}
    ),
}), shallow);

//Safe Selectors
export const useSafeStatuses = () =>
  useGlobalStore(
    (state) => ({
      temperature: state.temperature ?? 0,
      fanStatus: state.fanStatus ?? 'Unknown',
      feederStatus: state.feederStatus ?? 'Unknown',
      cycleStatus: state.cycleStatus ?? 'No cycle running',
      segmentInfo: state.segmentInfo ?? 'No segment info',
      obstacleStatus: state.obstacleStatus ?? 'Clear',
    }),
    shallow
  );

export const useSafeFieldSettings = () =>
  useGlobalStore(
    (state) => ({
      mode: state.mode ?? 'No mode has been selected yet by the user',
      fieldLength: state.fieldLength ?? 0,
      fieldWidth: state.fieldWidth ?? 0,
      motorSpeed: state.motorSpeed ?? 0,
      lastManualCommand: state.lastManualCommand ?? 'STOP',
      feederCommand: state.feederCommand ?? 'OFF',
    }),
    shallow
  );

export const useSafeCoopStats = () =>
  useGlobalStore(
    (state) => ({
      birdCount: state.birdCount ?? 0,
      eggCount: state.eggCount ?? 0,
      ailingBirdCount: state.ailingBirdCount ?? 0,
      birdsSold: state.birdsSold ?? 0,
      eggsSold: state.eggsSold ?? 0,
    }),
    shallow
  );