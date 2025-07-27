import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Doctor, Patient } from '../models/auth.model.ts';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const generateCustomId = (prefix: string): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNum}`;
};

const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      licenseNumber: user.licenseNumber ?? '',
      specialization: user.specialization ?? '',
      role: user instanceof Doctor ? 'doctor' : 'patient',
      customId: user.patientId ?? user.doctorId,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

export const registerDoctor = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone, // address,
      licenseNumber,
      specialization,
    } = req.body;

    const existingEmail = await Doctor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'License number already exists' });
    }

    const doctor = new Doctor({
      email,
      password,
      firstName,
      lastName,
      phone, // address,
      licenseNumber,
      specialization,
      doctorId: generateCustomId('DOC'),
    });

    await doctor.save();
    const token = generateToken(doctor);

    res.status(201).json({
      token,
      user: {
        id: doctor._id,
        email: doctor.email,
        role: 'doctor',
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        doctorId: doctor.doctorId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const registerPatient = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      gender,
    } = req.body;

    const existingEmail =
      (await Patient.findOne({ email })) || (await Doctor.findOne({ email }));
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const patient = new Patient({
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      gender,
      patientId: generateCustomId('PAT'),
    });

    await patient.save();
    const token = generateToken(patient);

    res.status(201).json({
      token,
      user: {
        id: patient._id,
        email: patient.email,
        role: 'patient',
        firstName: patient.firstName,
        lastName: patient.lastName,
        patientId: patient.patientId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    const patient = await Patient.findOne({ email });

    if (!doctor && !patient) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = doctor || patient;
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const isDoctor = user instanceof Doctor;
    const customId =
      isDoctor && 'doctorId' in user
        ? (user as any).doctorId
        : 'patientId' in user
          ? (user as any).patientId
          : null;

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user instanceof Doctor ? 'doctor' : 'patient',
        firstName: user.firstName,
        lastName: user.lastName,
        customId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const Model = req.user?.role === 'doctor' ? Doctor : Patient;
    const user = await (Model as typeof Doctor)
      .findById(req.user?.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Logout successful. Please clear the token on the client side.',
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const doctor = await Doctor.findOne({ email });
    const patient = await Patient.findOne({ email });

    if (!doctor && !patient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = doctor || (patient as any);
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender (your Gmail)
      to: email, // Recipient (user's email from request)
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetURL}\nThis link expires in 1 hour.`,
    });

    res
      .status(200)
      .json({ message: 'Password reset link sent to your email.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const doctor = await Doctor.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    const patient = await Patient.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    const user = doctor || (patient as any);
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
