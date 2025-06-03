// src/api/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export const api = {
  login: (credentials: { username: string; password: string }) =>
    axios.post(`${API_URL}/api/login`, credentials),

  register: (credentials: { username: string; password: string }) =>
    axios.post(`${API_URL}/api/register`, credentials),

  getStatus: () =>
    axios.get(`${API_URL}/api/status`),

  setField: (data: { fieldLength: number; fieldWidth: number; motorSpeed: number }) =>
    axios.post(`${API_URL}/api/setField`, data),

  setMode: (mode: { mode: string }) =>
    axios.post(`${API_URL}/api/setMode`, mode),

  manualControl: (cmd: { command: string }) =>
    axios.post(`${API_URL}/api/manualControl`, cmd),

  feederControl: (cmd: { feederCommand: string }) =>
    axios.post(`${API_URL}/api/feederControl`, cmd),

  coopStats: (stats: { birdCount: number; eggCount: number; ailingBirdCount: number }) =>
    axios.post(`${API_URL}/api/coopStats`, stats),

  salesLog: (sales: { birdsSold: number; eggsSold: number }) =>
    axios.post(`${API_URL}/api/salesLog`, sales),

  getCoopStatuses: () =>
    axios.get(`${API_URL}/api/coopStatuses`),

  getCoopStatsHistory: (summary = false) =>
    axios.get(`${API_URL}/api/coopStatsHistory${summary ? '?summary=true' : ''}`),

  getSalesLogHistory: (summary = false) =>
    axios.get(`${API_URL}/api/salesHistory${summary ? '?summary=true' : ''}`),
};