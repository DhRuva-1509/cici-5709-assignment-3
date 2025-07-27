import {CreditCard, Stethoscope} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "./avatar/avatar"
import {Badge} from "./avatar/badge"
import {useNavigate} from "react-router-dom"
import "./patients-table.css"
import type {Patient} from "../patient_list/PatientsList.tsx";


export default function PatientsTable(props: { patients: Patient[] }) {

    const navigate = useNavigate();

    const handlePatientClick = (patientId: string) => {
        navigate(`/a/patientsInfo/${patientId}`);
    }

    const handleOperationClick = (e: React.MouseEvent, operation: string) => {
        e.stopPropagation()
        console.log(`${operation} clicked`)
    }

    return (<>
        <div className="hidden md:block overflow-x-auto">
            {props.patients.length === 0 && (<div className="flex flex-col items-center justify-center h-full"
                                                  style={{minHeight: "300px", padding: "1rem"}}>
                <div className="text-gray-500 text-lg font-semibold">No patients found</div>
                <div className="text-gray-500 text-sm font-medium">
                    Add a patient to see them here or if you have scheduled an appointment, you can see them here.
                </div>
            </div>)}
            {props.patients.length > 0 && (
                <table className="w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-100 bg-white">
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Photo</th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Patient name</th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Operation</th>
                        <th className="px-4 lg:px-8 py-4 lg:py-5 text-left text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {props.patients.map((patient) => (
                        <tr
                            key={patient.id}
                            className="hover:bg-gray-50 transition"
                            onClick={() => handlePatientClick(patient.patientId)}
                        >
                            <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                                <Avatar className="h-10 w-10 lg:h-12 lg:w-12 ring-2 ring-gray-100">
                                    <AvatarImage
                                        src={patient.photo || `https://images.unsplash.com/photo-${1500000000000 + patient.id}?w=150&h=150&fit=crop&crop=face`}
                                        alt={patient.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback
                                        className="text-white font-semibold text-sm lg:text-lg"
                                        style={{ background: "linear-gradient(135deg, #60a5fa, var(--color-primary))" }}
                                    >
                                        {patient.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </td>
                            <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                                <div className="text-sm lg:text-base font-semibold text-gray-900">{patient.name}</div>
                            </td>
                            <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                                <div className="text-xs lg:text-sm text-gray-600 font-medium">{patient.mobile}</div>
                            </td>
                            <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                                <div className="text-xs lg:text-sm text-gray-600 font-medium">{patient.email}</div>
                            </td>
                            <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <div
                                        className="p-2 lg:p-2.5 rounded-lg border cursor-pointer hover:bg-blue-100 transition-colors hover:scale-105"
                                        style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.2)" }}
                                        onClick={(e) => handleOperationClick(e, 'stethoscope')}
                                    >
                                        <Stethoscope size={14} className="lg:w-4 lg:h-4" style={{ color: "var(--color-primary)" }} />
                                    </div>
                                    <div
                                        className="p-2 lg:p-2.5 rounded-lg border cursor-pointer hover:bg-blue-100 transition-colors hover:scale-105"
                                        style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.2)" }}
                                        onClick={(e) => handleOperationClick(e, 'payment')}
                                    >
                                        <CreditCard size={14} className="lg:w-4 lg:h-4" style={{ color: "var(--color-primary)" }} />
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                                <Badge
                                    variant={patient.paymentStatus === "Paid" ? "secondary" : "destructive"}
                                    className={
                                        patient.paymentStatus === "Paid"
                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-100 font-semibold px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm"
                                            : "bg-red-50 text-red-700 hover:bg-red-50 font-semibold px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-red-200 text-xs lg:text-sm"
                                    }
                                >
                                    {patient.paymentStatus}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>


            )}
        </div>
    </>)
}
