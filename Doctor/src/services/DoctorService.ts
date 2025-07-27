// apps/doctor/src/services/DoctorService.ts
import { HttpClient } from 'shared-modules/src/api/HttpClient';
import type { MyPatient } from '../types/patients/patient';

class DoctorService extends HttpClient {
  getMyPatients(): Promise<MyPatient[]> {
    return this.get<{ message: string; data: MyPatient[] }>('http://localhost:3000/api/doctors/mypatients')
      .then(res => res.data);
  }
}

export const doctorService = new DoctorService();