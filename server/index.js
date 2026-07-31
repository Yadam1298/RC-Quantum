const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const {
  setIoInstance,
  registerSocketSession,
  removeSocketSession,
  emitForceLogoutToUser,
} = require('./socketManager');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setIoInstance(io);

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());

app.use((req, res, next) => {
  console.log("=================================");
  console.log("METHOD :", req.method);
  console.log("URL    :", req.originalUrl);
  console.log("BODY   :", "undefined");
  console.log("=================================");
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Welcome to the Attendance Management System API');
});

io.on('connection', (socket) => {
  socket.on('register-session', ({ token }) => {
    registerSocketSession(socket, token);
  });

  socket.on('disconnect', () => {
    removeSocketSession(socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    server.listen(PORT, '0.0.0.0', () => console.log(`Server running on 0.0.0.0:${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});