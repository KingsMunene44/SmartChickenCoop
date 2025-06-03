// src/hooks/useMQTTSubscriptions.ts

import { useEffect } from 'react';
import { useGlobalStore } from '../store/globalstore';
import useMqttClient from '../services/mqttClient';
import mqtt, { MqttClient } from 'mqtt';

// Load MQTT broker URL from .env (e.g. VITE_MQTT_BROKER)
const brokerUrl = import.meta.env.VITE_MQTT_BROKER || 'ws://localhost:9001';

const TOPICS = {
  MODE: 'coop/mode',
  FIELD: 'coop/field',
  MANUAL: 'coop/manual/control',
  FEEDER: 'coop/feeder/control',
} as const;

const useMQTTSubscriptions = () => {
  useMqttClient(); // Activate base MQTT client for telemetry

  const setMode = useGlobalStore((s) => s.setMode);
  const setField = useGlobalStore((s) => s.setField);
  const setManualCommand = useGlobalStore((s) => s.setManualCommand);
  const setFeederCommand = useGlobalStore((s) => s.setFeederCommand);

  useEffect(() => {
    const client: MqttClient = mqtt.connect(brokerUrl, { reconnectPeriod: 2000 });

    const handleMessage = (topic: string, message: Buffer) => {
      const payload = message.toString();

      switch (topic) {
        case TOPICS.MODE:
          if (payload === 'AUTO' || payload === 'MANUAL') {
            setMode(payload);
          }
          break;

        case TOPICS.FIELD: {
          const [lengthStr, widthStr, speedStr] = payload.split(',');
          const length = parseInt(lengthStr, 10);
          const width = parseInt(widthStr, 10);
          const speed = parseInt(speedStr, 10);
          if (!isNaN(length) && !isNaN(width) && !isNaN(speed)) {
            setField(length, width, speed);
          }
          break;
        }

        case TOPICS.MANUAL:
          if (['FORWARD', 'BACKWARD', 'LEFT', 'RIGHT', 'STOP'].includes(payload)) {
            setManualCommand(payload as 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT' | 'STOP');
          }
          break;

        case TOPICS.FEEDER:
          if (payload === 'ON' || payload === 'OFF') {
            setFeederCommand(payload);
          }
          break;

        default:
          break;
      }
    };

    // ✅ Subscribe to all topics
    Object.values(TOPICS).forEach((topic) => {
      client.subscribe(topic);
    });

    client.on('message', handleMessage);

    return () => {
      client.off('message', handleMessage);
      Object.values(TOPICS).forEach((topic) => {
        client.unsubscribe(topic);
      });
      client.end();
    };
  }, [setMode, setField, setManualCommand, setFeederCommand]);
};

export default useMQTTSubscriptions;