// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const bcrypt = require('bcryptjs');


// Load Mongoose models
const User = require('./models/User');
const TempData = require('./models/TempData');
const FanStatus = require('./models/FanStatus');
const FeederStatus = require('./models/FeederStatus');
const CycleStatus = require('./models/CycleStatus');
const SegmentStatus = require('./models/SegmentStatus');
const ObstacleStatus = require('./models/ObstacleStatus');
const FieldData = require('./models/FieldData');
const CoopStats = require('./models/CoopStats');
const SalesLog = require('./models/SalesLog');

// Express app setup

const allowedOrigins = [
  "https://chickencoop-app.up.railway.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// MQTT Client (Local Mosquitto Broker)
const mqttClient = mqtt.connect(process.env.MQTT_BROKER); //processing mqtt broker at .env.MQTT_BROKER

mqttClient.on('connect', () => {
  console.log('✅ Connected to MQTT Broker');

  const topics = [
    'coop/status/cycle',
    'coop/status/segment',
    'coop/status/obstacle',
    'coop/temp/data',
    'coop/temp/fan',
    'coop/feeder/status'
  ];
  mqttClient.subscribe(topics, (err) => {
    if (!err) {
      console.log('✅ Subscribed to topics:', topics);
    }
  });
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT Client Error:', err);
  mqttClient.end();
});

mqttClient.on('offline', () => {
  console.warn('⚠️ MQTT Client Offline');
});

mqttClient.on('close', () => {
  console.warn('⚠️ MQTT Client Disconnected');
});

// Handle incoming MQTT messages
mqttClient.on('message', async (topic, message) => {
  const payload = message.toString();
  console.log(`📩 [${topic}] ${payload}`);

  try {
    switch(topic) {
      case 'coop/temp/data':
        await TempData.create({ temperature: parseFloat(payload) });
        break;
      case 'coop/temp/fan':
        await FanStatus.create({ status: payload });
        break;
      case 'coop/feeder/status':
        await FeederStatus.create({ status: payload });
        break;
      case 'coop/status/cycle':
        await CycleStatus.create({ cycle: payload });
        break;
      case 'coop/status/segment':
        await SegmentStatus.create({ segmentInfo: payload });
        break;
      case 'coop/status/obstacle':
        await ObstacleStatus.create({ status: payload });
        break;
      default:
        console.log('⚠️ Unknown topic:', topic);
    }
  } catch (err) {
    console.error('❌ DB Save Error:', err);
  }
});

//REST API Routes

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({ username, passwordHash });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    res.json({ message: 'Login successful', payload });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest temperature + fan status
app.get('/api/status', async (req, res) => {
  const temp = await TempData.findOne().sort({ timestamp: -1 });
  const fan = await FanStatus.findOne().sort({ timestamp: -1 });
  res.json({ temperature: temp?.temperature, fanStatus: fan?.status });
});

// Set field data
app.post('/api/setField', async (req, res) => {
  try {
    const { fieldLength, fieldWidth, motorSpeed } = req.body;

    if (
      typeof fieldLength !== 'number' || fieldLength <= 0 ||
      typeof fieldWidth !== 'number' || fieldWidth <= 0 ||
      typeof motorSpeed !== 'number' || motorSpeed <= 0
    ) {
      return res.status(400).json({ error: 'Invalid fieldLength, fieldWidth, or motorSpeed' });
    }

    const payload = `FIELD:${fieldLength},${fieldWidth},${motorSpeed}`;
    mqttClient.publish('coop/field', payload);

    await FieldData.create({ fieldLength, fieldWidth, motorSpeed });

    res.json({ message: 'Field settings sent and saved' });

  } catch (error) {
    console.error('Error in /api/setField:', error);
    res.status(500).json({ error: 'Server error while setting field data' });
  }
});

// Set coop mode
app.post('/api/setMode', (req, res) => {
  const { mode } = req.body;
  const allowedModes = ['AUTO', 'MANUAL'];
  if (!allowedModes.includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode. Must be AUTO or MANUAL.' });
  }

  mqttClient.publish('coop/mode', mode);
  res.json({ message: `Mode set to ${mode}` });
});

// Manual control
app.post('/api/manualControl', (req, res) => {
  const { command } = req.body;
  const allowedCommands = ['FORWARD', 'BACKWARD', 'LEFT', 'RIGHT', 'STOP'];
  if (!allowedCommands.includes(command)) {
    return res.status(400).json({ error: 'Invalid command. Must be FORWARD, BACKWARD, LEFT, RIGHT, or STOP.' });
  }

  mqttClient.publish('coop/manual/control', command);
  res.json({ message: `Manual control: ${command}` });
});

// Feeder control
app.post('/api/feederControl', (req, res) => {
  const { feederCommand } = req.body;
  const allowedCommands = ['ON', 'OFF'];
  if (!allowedCommands.includes(feederCommand)) {
    return res.status(400).json({ error: 'Invalid feeder command. Must be ON or OFF.' });
  }

  mqttClient.publish('coop/feeder/control', feederCommand);
  res.json({ message: `Feeder command sent: ${feederCommand}` });
});

// Coop stats logging
app.post('/api/coopStats', async (req, res) => {
  const { birdCount, eggCount, ailingBirdCount } = req.body;
  await CoopStats.create({ birdCount, eggCount, ailingBirdCount });
  res.json({ message: 'Coop stats saved' });
});

// Sales logging
app.post('/api/salesLog', async (req, res) => {
  const { birdsSold, eggsSold } = req.body;

  if (
    !Number.isInteger(birdsSold) || birdsSold < 0 ||
    !Number.isInteger(eggsSold) || eggsSold < 0
  ) {
    return res.status(400).json({ error: 'Invalid sales data. birdsSold and eggsSold must be non-negative integers.' });
  }

  try {
    await SalesLog.create({ birdsSold, eggsSold });
    res.json({ message: 'Sales log saved' });
  } catch (err) {
    console.error('Database error (SalesLog.create):', err);
    res.status(500).json({ error: 'Failed to save sales log' });
  }
});

//Coop Stats History
app.get('/api/coopStatsHistory', async (req, res) => {
  try {
    if (req.query.summary === 'true') {
      // Aggregate total birdCount, eggCount, ailingBirdCount from all records
      const totals = await CoopStats.aggregate([
        {
          $group: {
            _id: null,
            totalBirdCount: { $sum: '$birdCount' },
            totalEggCount: { $sum: '$eggCount' },
            totalAilingBirdCount: { $sum: '$ailingBirdCount' }
          }
        }
      ]);

      const result = totals[0] || { totalBirdCount: 0, totalEggCount: 0, totalAilingBirdCount: 0 };

      return res.json({
        birdCount: result.totalBirdCount,
        eggCount: result.totalEggCount,
        ailingBirdCount: result.totalAilingBirdCount
      });
    }

    //Return full array if no summary param
    const stats = await CoopStats.find().sort({ timestamp: -1 });
    res.json(stats);
  } catch (err) {
    console.error('❌ CoopStats history fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch coop stats history' });
  }
});

//Sales Log History
app.get('/api/salesHistory', async (req, res) => {
  try {
    if (req.query.summary === 'true') {
      //Aggregate total birdsSold and eggsSold from all records
      const totals = await SalesLog.aggregate([
        {
          $group: {
            _id: null,
            totalBirdsSold: { $sum: '$birdsSold' },
            totalEggsSold: { $sum: '$eggsSold' }
          }
        }
      ]);

      const result = totals[0] || { totalBirdsSold: 0, totalEggsSold: 0 };

      return res.json({
        birdsSold: result.totalBirdsSold,
        eggsSold: result.totalEggsSold
      });
    }

    //Return full array if no summary param
    const logs = await SalesLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error('❌ Sales history fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch sales log history' });
  }
});

// Get coop statuses
app.get('/api/coopStatuses', async (req, res) => {
  try {
    const cycle = await CycleStatus.findOne().sort({ timestamp: -1 });
    const segment = await SegmentStatus.findOne().sort({ timestamp: -1 });
    const obstacle = await ObstacleStatus.findOne().sort({ timestamp: -1 });

    res.json({
      cycleStatus: cycle?.cycle || null,
      segmentInfo: segment?.segmentInfo || null,
      obstacleStatus: obstacle?.status || null
    });
  } catch (err) {
    console.error('❌ CoopStatuses fetch error:', err);
    res.status(500).json({ message: 'Server error fetching coop statuses' });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0',() => console.log(`🚀 Server running on port ${PORT}`));