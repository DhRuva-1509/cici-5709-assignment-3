import {useState} from "react"
import PatientsHeader from "../components/patients-header"
import PatientsTable from "../components/patients-table"
import PatientsMobileCards from "../components/patients-mobile-cards"
import "../../a/components/AElement.css"


export interface Patient {
    id: number
    name: string
    mobile: string
    email: string
    photo: string
    paymentStatus: string,
    patientId: string
}

const initialPatients = [{
    id: 1,
    name: "John",
    mobile: "+(093)2345678",
    email: "Johndrake@gmail.com",
    photo: "/placeholder.svg?height=40&width=40",
    paymentStatus: "Paid",
    patientId: "12"
}, {
    "id": 1753478874658,
    "name": "Mohammed Hashim",
    "mobile": "7828991303",
    "email": "mohammedhashim811@gmail.com",
    "photo": "/placeholder.svg?height=40&width=40",
    "paymentStatus": "Pending",
    "patientId": "PAT55439"
}]

export default function PatientsList() {
    const [patients, setPatients] = useState(initialPatients)


    const handlePatientAdded = (newPatient: Patient) => {
        setPatients((prev: Patient[]) => [...prev, newPatient])
    }

    return (<div className="dashboard-container">
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <PatientsHeader onPatientAdded={handlePatientAdded}/>
                <PatientsTable patients={patients}/>
                <PatientsMobileCards patients={patients}/>
            </div>
        </div>
    </div>);
}
