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
import { handleSocketConnection } from "./utils/socket.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
handleSocketConnection(io);

app.use(express.json());

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carebridge-md')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('CareBridge MD Backend');
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/documents', documentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/intake-forms', intakeformRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/health-records', healthRecordsRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
