import React from "react";
import { ROUTES } from "../../Common/Constants";
import { Link } from "react-router-dom";

function DoctorPage() {
  const links = [
    {
      name: "My Appointments",
      route: ROUTES.doctor.getAppointments,
    },
    {
      name: "My Availability",
      route: ROUTES.doctor.getAvailability,
    },
  ];
  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="d-flex flex-column" style={{ marginTop: "150px" }}>
          <h2 className="mb-4">Quick Links</h2>
          {links.map((link, ind) => {
            return (
              <Link key={ind} className="btn btn-primary mb-2" to={link.route}>
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DoctorPage;
