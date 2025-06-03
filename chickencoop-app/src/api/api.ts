// src/api/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export const api = {
  login: (credentials: { username: string; password: string }) =>
    axios.post(`${API_URL}/login`, credentials),

  register: (credentials: { username: string; password: string }) =>
    axios.post(`${API_URL}/register`, credentials),

  getStatus: () =>
    axios.get(`${API_URL}/status`),

  setField: (data: { fieldLength: number; fieldWidth: number; motorSpeed: number }) =>
    axios.post(`${API_URL}/setField`, data),

  setMode: (mode: { mode: string }) =>
    axios.post(`${API_URL}/setMode`, mode),

  manualControl: (cmd: { command: string }) =>
    axios.post(`${API_URL}/manualControl`, cmd),

  feederControl: (cmd: { feederCommand: string }) =>
    axios.post(`${API_URL}/feederControl`, cmd),

  coopStats: (stats: { birdCount: number; eggCount: number; ailingBirdCount: number }) =>
    axios.post(`${API_URL}/coopStats`, stats),

  salesLog: (sales: { birdsSold: number; eggsSold: number }) =>
    axios.post(`${API_URL}/salesLog`, sales),

  getCoopStatuses: () =>
    axios.get(`${API_URL}/coopStatuses`),

  getCoopStatsHistory: (summary = false) =>
    axios.get(`${API_URL}/coopStatsHistory${summary ? '?summary=true' : ''}`),

  getSalesLogHistory: (summary = false) =>
    axios.get(`${API_URL}/salesHistory${summary ? '?summary=true' : ''}`),
};