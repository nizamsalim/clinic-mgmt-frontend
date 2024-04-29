export const ROUTES = {
  adminHome: "/admin",
  patientHome: "/patient",
  doctorHome: "/doctor",
  login: "/auth/login",
  signup: "/auth/signup",
  admin: {
    getDoctors: "/admin/doctors",
    createDoctor: "/admin/doctor/create",
    getAppointments: "/admin/appointments",
    getPatients: "/admin/patients",
  },
  doctor: {
    getAppointments: "/doctor/appointments",
    getAvailability: "/doctor/availability",
    createAvailability: "/doctor/availability/create",
  },
};

export const USER_ROLES = {
  admin: "ADMIN",
  patient: "PATIENT",
  doctor: "DOCTOR",
};

const API_BASE_URL = "http://localhost:5000";
const AUTH_API = `${API_BASE_URL}/api/auth`;
const ADMIN_API = `${API_BASE_URL}/api/admin`;
const PATIENT_API = `${API_BASE_URL}/api/patient`;
const DOCTOR_API = `${API_BASE_URL}/api/doctor`;

export const API = {
  auth: {
    adminLogin: `${AUTH_API}/admin/login`,
    patientLogin: `${AUTH_API}/patient/login`,
    doctorLogin: `${AUTH_API}/doctor/login`,
    patientSignup: `${AUTH_API}/patient/signup`,
  },
  admin: {
    createDoctor: `${ADMIN_API}/doctor/create`,
    updateDoctor: `${ADMIN_API}/doctor/update`,
    deleteDoctor: `${ADMIN_API}/doctor/delete`,
    getDoctors: `${ADMIN_API}/doctors/get`,
    getDepartments: `${ADMIN_API}/departments`,
    getSpecialization: `${ADMIN_API}/specialization`,
  },
  doctor: {
    createAvailability: `${DOCTOR_API}/availability/create`,
    deleteAvailability: `${DOCTOR_API}/availability/delete`,
    getMyAppointments: `${DOCTOR_API}/appointments`,
    getMyAvailability: `${DOCTOR_API}/availability/get`,
    getTimeSlotsByDate: `${DOCTOR_API}/timeslot/get`,
  },
  patient: {
    createAppointment: `${PATIENT_API}/appointment/create`,
  },
};
