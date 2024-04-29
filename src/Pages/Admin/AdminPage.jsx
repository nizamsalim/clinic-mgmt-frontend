import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Common/Constants";

function AdminPage() {
  const links = [
    {
      name: "Doctors",
      route: ROUTES.admin.getDoctors,
    },
    {
      name: "Patients",
      route: ROUTES.admin.getPatients,
    },
    {
      name: "Appointments",
      route: ROUTES.admin.getAppointments,
    },
  ];
  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column" style={{ marginTop: "150px" }}>
        <h2 className="mb-4">Quick Links</h2>
        {links.map((link) => {
          return (
            <Link className="btn btn-primary mb-2" to={link.route}>
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default AdminPage;
