import {useEffect, useState} from "react"
import {
    Calendar,
    Clock,
    Edit,
    FileArchive,
    FileText,
    Heart,
    Mail,
    NotepadText,
    Phone,
    Pill,
    PlusCircle,
    Shield,
    UserCheck,
} from "lucide-react"
import "./PatientInfo.css"
import {useDialog} from "../../utils/dialog/dialog.tsx";
import {PrescriptionForm} from "../../prescription/prescription.tsx";
import {PatientService} from "../../../../../shared-modules/src/api/patient.service.ts";
import {useParams} from "react-router-dom";
import {calculateAge, nameToInitials, prettyAddress, prettyDate} from "../../utils/utils.ts";
import {Prescription} from "../../../../../shared-modules/src/api/prescription.service.ts";
import {PrescriptionGenerator} from "../../prescription/components/prescription-generator/prescription-generator.tsx";
import UploadFile from "../../prescription/components/upload-file/upload-file.tsx";
import {FileService} from "../../../../../shared-modules/src/api/file.service.ts";

export interface PatientInfo {
    "address": {
        "street": string, "city": string, "state": string, "postalCode": string, "country": string
    },
    "_id": string,
    "email": string,
    "firstName": string,
    "lastName": string,
    "phone": string,
    "dateOfBirth": string,
    "gender": string,
    "patientId": string,
    "__v": 0
}


export function showFileLayout(props: any) {
    return (<div style={{width: "100%", height: "100%"}}>
        <iframe
            style={{width: "50vw", height: "50vh"}}
            src={`https://carebridge-assets.s3.ca-central-1.amazonaws.com/${props.file.key}`}></iframe>
    </div>);
}

export default function PatientInfo() {
    const [activeTab, setActiveTab] = useState("upcoming");

    const baseURL = "http://localhost:3000/api";

    const [files, setFiles] = useState<{ files: any }>({files: []});

    const {id} = useParams();
    const [patient, setPatient] = useState<PatientInfo>();
    const [prescriptions, setPrescriptions] = useState<{ prescriptions: any }>({prescriptions: []});

    const upcomingVisits = [{
        id: 1,
        date: "26 June 2025",
        time: "12.00-12.30",
        service: "Sore Throat, Flu",
        doctor: "John Drake",
        status: "Scheduled",
    }, {
        id: 2, date: "29 June 2025", time: "12.30-1.30", service: "Teeth Cleaning", doctor: "Mike", status: "Scheduled",
    },]

    const pastVisits = [{
        id: 1,
        date: "15 May 2025",
        time: "10.00-10.30",
        service: "General Checkup",
        doctor: "Dr. Smith",
        status: "Completed",
    }, {
        id: 2,
        date: "20 April 2025",
        time: "14.00-14.30",
        service: "Blood Test",
        doctor: "Dr. Johnson",
        status: "Completed",
    }]

    const {showDialog, closeDialog} = useDialog();

    const getPatientInfo = async () => {
        const api = new PatientService(baseURL);
        return await api.getPatient(id ?? "");
    }

    const getPrescriptions = async (patientId: string) => {
        const api = new Prescription(baseURL);
        return api.list(patientId);
    }

    const getFiles = async (patientId: string) => {
        const api = new FileService(baseURL);
        return api.getFilesByPatient(patientId);
    }

    const showFile = (file) => {
        showDialog({
            template: showFileLayout, params: {
                isBarrierDismissible: true, onClose: closeDialog, background: 'rgba(0, 0, 0, 0.5)',
            }, componentProps: {
                file
            }
        })
    }


    useEffect(() => {
        getPatientInfo().then((patient) => {
            setPatient(patient);
            getPrescriptions(patient._id).then((prescriptions) => {
                setPrescriptions(prescriptions);
            });
            getFiles(patient._id).then((files) => {
                setFiles(files);
            });
        })
    }, []);


    const showPrescriptionForm = () => {
        showDialog({
            template: PrescriptionForm, params: {
                isBarrierDismissible: true, onClose: closeDialog, background: 'rgba(0, 0, 0, 0.5)',
            }, componentProps: {
                patient
            }
        });
    }

    const showPrescription = (prescription) => {
        showDialog({
            template: PrescriptionGenerator, params: {
                isBarrierDismissible: true, onClose: closeDialog, background: 'rgba(0, 0, 0, 0.5)',
            }, componentProps: {
                prescription: prescription
            }
        });
    }

    const showUploadDialog = () => {
        showDialog({
            template: UploadFile, params: {
                isBarrierDismissible: true, onClose: closeDialog, background: 'rgba(0, 0, 0, 0.5)',
            }, componentProps: {
                patient
            }
        });
    }


    return (<div className="content-wrapper">
        <div className="page-header">
            <div className="page-title-section">
                <h2 className="page-title">Patient Profile</h2>
            </div>

        </div>

        <div className="patient-profile-section">
            <div className="patient-card">
                {patient && <div className="patient-header">
                    <div className="patient-avatar">
                            <span className="avatar-image">
                                {nameToInitials(patient.firstName, patient.lastName)}
                            </span>
                    </div>
                    <div className="patient-basic-info">
                        <h3 className="patient-name">{patient.firstName + " " + patient.lastName}</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <Phone size={14}/>
                                <span>{patient.phone}</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={14}/>
                                <span>{patient.email}</span>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>

        <div className="content-grid">
            <div className="info-card general-info">
                <h4 className="card-title">General Information</h4>
                {patient && <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Date of birth:</span>
                        <span className="info-value">{prettyDate(patient!.dateOfBirth)}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Age:</span>
                        <span className="info-value">{calculateAge(patient!.dateOfBirth)}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Gender:</span>
                        <span className="info-value">{patient!.gender}</span>
                    </div>
                    <div className="info-item full-width">
                        <span className="info-label">Address:</span>
                        <span className="info-value">{prettyAddress(patient!.address)}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Emergency Contact:</span>
                        <span className="info-value">N/A</span>
                    </div>
                </div>}
            </div>

            <div className="info-card medical-info">
                <h4 className="card-title">Medical Information</h4>
                <div className="medical-grid">
                    <div className="medical-item">
                        <div className="medical-icon">
                            <Shield size={16}/>
                        </div>
                        <div className="medical-content">
                            <span className="medical-label">Allergies:</span>
                            <span className="medical-value">Nuts, Mushroom</span>
                        </div>
                    </div>
                    <div className="medical-item">
                        <div className="medical-icon">
                            <Pill size={16}/>
                        </div>
                        <div className="medical-content">
                            <span className="medical-label">Medicine Allergies:</span>
                            <span className="medical-value">High Antibiotics</span>
                        </div>
                    </div>
                    <div className="medical-item">
                        <div className="medical-icon">
                            <Heart size={16}/>
                        </div>
                        <div className="medical-content">
                            <span className="medical-label">Blood Group:</span>
                            <span className="medical-value">A+</span>
                        </div>
                    </div>
                    <div className="medical-item">
                        <div className="medical-icon">
                            <FileText size={16}/>
                        </div>
                        <div className="medical-content">
                            <span className="medical-label">Past Illness:</span>
                            <span className="medical-value">Thyroid</span>
                        </div>
                    </div>
                    <div className="medical-item">
                        <div className="medical-icon">
                            <UserCheck size={16}/>
                        </div>
                        <div className="medical-content">
                            <span className="medical-label">Vaccination:</span>
                            <span className="medical-value">Covaccine</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="info-card tabbed-card">
                <div className="tab-header">
                    <button
                        className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        Upcoming Visits (2)
                    </button>
                    <button
                        className={`tab-button ${activeTab === "past" ? "active" : ""}`}
                        onClick={() => setActiveTab("past")}
                    >
                        Past Visits (2)
                    </button>
                    <button
                        className={`tab-button ${activeTab === "prescriptions" ? "active" : ""}`}
                        onClick={() => setActiveTab("prescriptions")}
                    >
                        Prescriptions
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "upcoming" && (<div className="visits-content">
                        <div className="visits-list">
                            {upcomingVisits.map((visit) => (<div key={visit.id} className="visit-item">
                                <div className="visit-icon">
                                    <Calendar size={20}/>
                                </div>
                                <div className="visit-details">
                                    <div className="visit-service">{visit.service}</div>
                                    <div className="visit-datetime">
                                        {visit.date} • {visit.time}
                                    </div>
                                    <div className="visit-doctor">Doctor: {visit.doctor}</div>
                                </div>
                            </div>))}
                        </div>
                    </div>)}

                    {activeTab === "past" && (<div className="visits-content">
                        <div className="visits-list">
                            {pastVisits.map((visit) => (<div key={visit.id} className="visit-item">
                                <div className="visit-icon">
                                    <Clock size={20}/>
                                </div>
                                <div className="visit-details">
                                    <div className="visit-service">{visit.service}</div>
                                    <div className="visit-datetime">
                                        {visit.date} • {visit.time}
                                    </div>
                                    <div className="visit-doctor">Doctor: {visit.doctor}</div>
                                </div>
                            </div>))}
                        </div>
                    </div>)}

                    {activeTab === "prescriptions" && (<div className="prescription-content">
                        <div className="prescription-list">
                            <button className="action-btn edit-btn" onClick={showPrescriptionForm}>
                                <Edit size={16}/>
                                <span>New Prescription</span>
                            </button>
                            {prescriptions.prescriptions.map((prescription: { medications: any[], createdAt: any }) => {
                                return <div className="prescription-item" onClick={() => showPrescription(prescription)}
                                            style={{cursor: "pointer"}}>
                                    <div className="prescription-icon">
                                        <Pill size={20}/>
                                    </div>
                                    <div className="prescription-details">
                                        <div
                                            className="prescription-name">{new Date(prescription.createdAt).toLocaleDateString()}</div>
                                        <div className="prescription-dosage">
                                            {prescription.medications[0].name}
                                            {prescription.medications.length - 1 > 0 ? (" & " + (prescription.medications.length - 1).toString() + " others") : ""}
                                        </div>
                                    </div>
                                </div>
                            })}
                            {prescriptions.prescriptions.length === 0 && <div className="no-prescriptions">
                                <div className="no-prescriptions-icon"
                                     style={{
                                         display: "flex",
                                         alignItems: "center",
                                         justifyContent: "center",
                                         flexDirection: "column",
                                         margin: 'auto'
                                     }}>
                                    <NotepadText size={20}/>
                                    <span>
                                        No Prescriptions for the patient.
                                        <a onClick={showPrescriptionForm}> Create a new one</a>
                                    </span>
                                </div>
                            </div>}
                        </div>
                    </div>)}
                </div>
            </div>

            <div className="info-card files-card">
                <span className="card-header"
                      style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                    <h4 className="card-title">Files</h4>
                    <button className="action-btn" onClick={showUploadDialog}>
                        <PlusCircle size={16}/>
                        <span>Upload File</span>
                    </button>
                </span>
                <div className="files-list">
                    {files.files.map((file, index) => (<div key={index} className="file-item">
                        <div className="file-info" onClick={() => showFile(file)}>
                            <span style={{cursor: "pointer", display: "flex", flexDirection: "row", gap: "10px"}}>
                                <FileText size={20} color="var(--color-primary)"/>
                                <span className="file-name">{file.name}</span>
                            </span>
                            <div className="file-details">
                                <span className="file-size">{new Date(file.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>))}
                    {files.files.length === 0 && <div className="no-files-icon"
                                                      style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          justifyContent: "center",
                                                          flexDirection: "column",
                                                          margin: 'auto',
                                                          width: '100%',
                                                      }}>
                        <FileArchive size={36}/>
                        <span>No files uploaded for this patient</span>
                    </div>}
                </div>
            </div>
        </div>
    </div>)
}
