import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminPage from "./Pages/Admin/AdminPage";
import PatientPage from "./Pages/Patient/PatientPage";
import DoctorPage from "./Pages/Doctor/DoctorPage";
import { ROUTES, USER_ROLES } from "./Common/Constants";
import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";
import { AuthProvider } from "./Common/AuthContext";
import { ProtectedRoute } from "./Components/Auth/ProtectedRoute";
import { AuthRoute } from "./Components/Auth/AuthRoute";
import Navbar from "./Components/Navbar";
import DisplayDoctors from "./Pages/Admin/DisplayDoctors";
import CreateDoctor from "./Pages/Admin/CreateDoctor";
import DisplayAvailability from "./Pages/Doctor/DisplayAvailability";
import DisplayAppointments from "./Pages/Doctor/DisplayAppointments";
import CreateAvailability from "./Pages/Doctor/CreateAvailability";
import DeptSpec from "./Pages/Admin/DeptSpec";
import ViewAppointmentsPatient from "./Pages/Patient/ViewAppointments";
import ViewAppointmentsAdmin from "./Pages/Admin/ViewAppointments";
import DisplayPatients from "./Pages/Admin/DisplayPatients";
import { AlertProvider } from "./Common/AlertContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: ROUTES.adminHome,
        element: (
          <ProtectedRoute userRole={USER_ROLES.admin}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.admin.getDoctors,
        element: (
          <ProtectedRoute userRole={USER_ROLES.admin}>
            <DisplayDoctors />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.admin.getPatients,
        element: (
          <ProtectedRoute userRole={USER_ROLES.admin}>
            <DisplayPatients />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.admin.getAppointments,
        element: (
          <ProtectedRoute userRole={USER_ROLES.admin}>
            <ViewAppointmentsAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.admin.createDoctor,
        element: (
          <ProtectedRoute userRole={USER_ROLES.admin}>
            <CreateDoctor />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.admin.departmentsAndSpecializations,
        element: (
          <ProtectedRoute userRole={USER_ROLES.admin}>
            <DeptSpec />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.patientHome,
        element: (
          <ProtectedRoute userRole={USER_ROLES.patient}>
            <PatientPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.patient.getAppointments,
        element: (
          <ProtectedRoute userRole={USER_ROLES.patient}>
            <ViewAppointmentsPatient />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.doctorHome,
        element: (
          <ProtectedRoute userRole={USER_ROLES.doctor}>
            <DoctorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.doctor.getAvailability,
        element: (
          <ProtectedRoute userRole={USER_ROLES.doctor}>
            <DisplayAvailability />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.doctor.createAvailability,
        element: (
          <ProtectedRoute userRole={USER_ROLES.doctor}>
            <CreateAvailability />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.doctor.getAppointments,
        element: (
          <ProtectedRoute userRole={USER_ROLES.doctor}>
            <DisplayAppointments />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: ROUTES.signup,
    element: (
      <AuthRoute>
        <SignupPage />
      </AuthRoute>
    ),
  },
  {
    path: ROUTES.login,
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    ),
  },
]);

root.render(
  <React.StrictMode>
    <AlertProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AlertProvider>
  </React.StrictMode>
);
