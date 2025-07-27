import {
  Calendar,
  Clock,
  Edit,
  FileLock2,
  Mail,
  Phone,
  StickyNote,
  User,
  Video,
} from "lucide-react";
import "./dashboard.css";
import doctor_profile from "../../assets/images/doctor-profile.jpeg";
import CalendarWidget from "./components/calendar/calendar.tsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = {
    firstName: "John",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    specialization: "Cardiology",
    licenseNumber: "ABC123456789",
  };

  const appointments = [
    {
      appointmentDate: new Date().toISOString(),
      patientId: "PAT1001",
      status: "scheduled",
      meetingId: "test-meeting-001",
      token: "dummy-token-123",
    },
  ];

  const handleJoin = (appointment: any) => {
    navigate("/meeting", {
      state: {
        meetingId: appointment.meetingId,
        token: appointment.token,
      },
    });
  };

  const calendarEvents = [
    {
      date: new Date().getDate(),
      bubbleMessage: "3",
      events: ["Appointment with Tom"],
      onClick: () => {},
    },
  ];

  const notes = [
    { name: "Note A.pdf", size: "1.1 Mb" },
    { name: "Note B.pdf", size: "2.0 Mb" },
  ];

  const now = new Date();
  const todayAppointments = appointments.filter((appointment) => {
    const date = new Date(appointment.appointmentDate);
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear() &&
      date > now
    );
  });

  return (
    <div className="dashboard-container">
      <div className="profile-content">
        <div className="profile-main">
          <div className="doctor-card">
            <div className="doctor-avatar">
              <img src={doctor_profile} alt="Dr Profile" />
            </div>
            <div className="doctor-info">
              <h2>Dr. {user.firstName}</h2>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="contact-item">
                  <FileLock2 size={16} />
                  <span>DS12309JJKNUIASD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-sections">
            <div className="info-section">
              <div className="section-header">
                <h3>General information</h3>
                <Edit size={16} />
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Date of birth:</label>
                  <span>23. 07. 1994</span>
                </div>
                <div className="info-item">
                  <label>Speciality:</label>
                  <span>{user.specialization}</span>
                </div>
                <div className="info-item">
                  <label>Licence Number</label>
                  <span>********{user.licenseNumber.slice(-4)}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="section-header">
                <h3>Upcoming Appointment</h3>
                <Calendar size={16} />
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Patient Name:</label>
                  <span>Tom Cruise</span>
                </div>
                <div className="info-item">
                  <label>Reason:</label>
                  <span>Post Mission Checkup</span>
                </div>
                <div className="info-item">
                  <label>Blood type:</label>
                  <span>O+</span>
                </div>
                <div className="info-item">
                  <label>Last Visit:</label>
                  <span>MI: Dead Reckoning</span>
                </div>
              </div>
            </div>
          </div>

          <div className="visits-section">
            <div className="tabs">
              <button className="tab">Appointment</button>
            </div>

            <div className="overflow-y-auto max-h-[500px] space-y-4 pr-2">
              {appointments.map((appointment, index) => {
                const dateObj = new Date(appointment.appointmentDate);
                const time = dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-3 min-w-[140px]">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {time}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {dateObj.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 min-w-[180px]">
                          <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Patient
                            </div>
                            <div className="font-medium text-gray-900">
                              {appointment.patientId}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Status
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleJoin(appointment)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="profile-sidebar">
          <CalendarWidget events={calendarEvents} />
          <div className="sidebar-section">
            <div className="section-header">
              <h3>Notes</h3>
              <button onClick={() => handleJoin(appointments[0])} className="download-all">
                DOWNLOAD
              </button>
            </div>
            <div className="files-list">
              {notes.map((note, index) => (
                <div key={index} className="file-item">
                  <StickyNote size={16} />
                  <div className="file-info">
                    <span className="file-name">{note.name}</span>
                    <span className="file-size">{note.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
