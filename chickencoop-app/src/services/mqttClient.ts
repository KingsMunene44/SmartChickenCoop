import { useEffect } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { useGlobalStore } from '../store/globalstore';

const brokerUrl = import.meta.env.VITE_MQTT_BROKER;


const useMqttClient = () => {
  const setTemperature = useGlobalStore(state => state.setTemperature);
  const setFanStatus = useGlobalStore(state => state.setFanStatus);
  const setFeederStatus = useGlobalStore(state => state.setFeederStatus);
  const setCycleStatus = useGlobalStore(state => state.setCycleStatus);
  const setSegmentInfo = useGlobalStore(state => state.setSegmentInfo);
  const setObstacleStatus = useGlobalStore(state => state.setObstacleStatus);

  useEffect(() => {
    const client: MqttClient = mqtt.connect(brokerUrl, {reconnectPeriod: 2000,});

    client.on('connect', () => {
      console.log('✅ MQTT Connected (React App)');

      const topics = [
        'coop/status/cycle',
        'coop/status/segment',
        'coop/status/obstacle',
        'coop/temp/data',
        'coop/temp/fan',
        'coop/feeder/status',
      ];

      client.subscribe(topics, (err: Error | null) => {
        if (err) {
          console.error('❌ MQTT Subscribe Error:', err.message);
        } else {
          console.log('✅ Subscribed to topics:', topics);
        }
      });
    });

    client.on('error', (err: Error) => {
      console.error('❌ MQTT Client Error:', err.message);
    });

    client.on('offline', () => {
      console.warn('⚠️ MQTT Client Offline');
    });

    client.on('message', (topic: string, message: Buffer) => {
      const payload = message.toString();

      switch (topic) {
        case 'coop/temp/data':
          setTemperature(Number(payload));
          break;

        case 'coop/temp/fan':
          setFanStatus(payload);
          break;

        case 'coop/feeder/status':
          setFeederStatus(payload);
          break;

        case 'coop/status/cycle':
          setCycleStatus(payload);
          break;

        case 'coop/status/segment':
          setSegmentInfo(payload);
          break;

        case 'coop/status/obstacle':
          setObstacleStatus(payload);
          break;

        default:
          console.warn('❓ Unknown topic:', topic);
      }
    });

    return () => {
      client.end(); // Clean up when component unmounts
    };
  }, [setTemperature, setFanStatus, setFeederStatus, setCycleStatus, setSegmentInfo, setObstacleStatus]);

  return null; // This hook doesn't render anything, it just manages MQTT subscriptions
};

export default useMqttClient;