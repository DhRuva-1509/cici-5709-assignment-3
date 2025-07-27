import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.ts';
import appointmentRoutes from './routes/appointment.route.ts';
import doctorRoutes from './routes/doctor.routes.ts';
import documentRoutes from './routes/document.routes.ts';
import meetingRoutes from './routes/meeting.route.ts';
import patientRoutes from './routes/patient.routes.ts';
import intakeformRoutes from './routes/intakeform.routes.ts';
import prescriptionRoutes from './routes/prescription.routes.ts';
import healthRecordsRoutes from './routes/health-records.routes.ts';
import fileRoutes from './routes/file.routes.ts';
import * as http from "node:http";
import { Server as SocketIOServer } from 'socket.io';
import {handleSocketConnection} from "./utils/socket.ts";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Setup WebSocket server
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
handleSocketConnection(io);

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware
app.use(cors({origin: '*', optionsSuccessStatus: 200}));

// MongoDB connection
mongoose
  .connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/carebridge-md'
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('CareBridge MD Backend');
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Doctor routes
app.use('/api/doctors', doctorRoutes);

// Patient routes
app.use('/api/patients', patientRoutes);

// Appointment routes
app.use('/api/appointments', appointmentRoutes);

app.use('/documents', documentRoutes);

app.use("/api/meetings", meetingRoutes);

// IntakeForm routes
app.use('/api/intake-forms', intakeformRoutes);

app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/files", fileRoutes);

// HealthRecords routes
app.use('/api/health-records', healthRecordsRoutes);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
