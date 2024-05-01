import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../Common/Constants";

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const auth_token = localStorage.getItem("auth_token");
  useEffect(() => {
    axios
      .get(API.patient.getMyAppointments, { headers: { auth_token } })
      .then(({ data }) => {
        if (data.success) {
          if (data.appointments.length === 0) {
            setError("You have no upcoming appointments");
          }
          setAppointments(data.appointments);
        }
      });

    return () => {};
  }, [auth_token]);

  const handleCancelAppointment = (ap_id) => {};

  return (
    <div className="container">
      <h3 className="text-center mt-3">My Appointments</h3>
      {error !== "" ? (
        <h4 className="text-center">{error}</h4>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Appointment Number</th>
              <th scope="col">Doctor Name</th>
              <th scope="col">Department</th>
              <th scope="col">Specialization</th>
              <th scope="col">Date</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Status</th>
              <th scope="col">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((ap, ind) => {
              return (
                <tr
                  key={ind}
                  className={`${
                    ap.status === "BOOKED" ? "table-warning" : "table-success"
                  }`}
                >
                  <th scope="row">{ap.appointment_id}</th>
                  <td>{ap.name}</td>
                  <td>{ap.department_name}</td>
                  <td>{ap.specialization_name}</td>
                  <td>{new Date(ap.date).toDateString()}</td>
                  <td>{ap.start_time}</td>
                  <td>{ap.end_time}</td>
                  <td>{ap.status}</td>
                  <td>
                    {ap.status === "BOOKED" ? (
                      <button
                        className="btn btn-danger"
                        onClick={(e) =>
                          handleCancelAppointment(ap.appointment_id)
                        }
                      >
                        Cancel
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewAppointments;
