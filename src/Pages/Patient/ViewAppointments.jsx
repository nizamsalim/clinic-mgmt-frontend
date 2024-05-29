import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../Common/Constants";
import { useAlert } from "../../Common/AlertContext";
import { Button, Modal } from "react-bootstrap";

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const auth_token = localStorage.getItem("auth_token");
  const [flaggedAppointmentId, setFlaggedAppointmentId] = useState("");

  const { showAlert } = useAlert();

  const getAppointments = () => {
    axios
      .get(API.patient.getMyAppointments, { headers: { auth_token } })
      .then(({ data }) => {
        if (data.success) {
          if (data.appointments.length === 0) {
            setError("You have no upcoming appointments");
          }
          console.log(data.appointments);
          setAppointments(data.appointments);
        }
      });
  };
  useEffect(() => {
    getAppointments();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelAppointment = (ap_id) => {
    console.log(ap_id);
    axios
      .delete(`${API.patient.cancelAppointment}/${ap_id}`, {
        headers: { auth_token },
      })
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        showAlert("Appointment cancelled");
        handleClose();
        getAppointments();
      })
      .catch((err) => showAlert("Something went wrong"));
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel the appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={(e) => handleCancelAppointment(flaggedAppointmentId)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
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
              let status;
              switch (ap.status) {
                case "BOOKED":
                  status = "table-warning";
                  break;
                case "COMPLETED":
                  status = "table-success";
                  break;
                case "CANCELLED":
                  status = "table-danger";
                  break;
                default:
                  break;
              }
              return (
                <tr key={ind} className={status}>
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
                        onClick={(e) => {
                          setFlaggedAppointmentId(ap.appointment_id);
                          handleShow();
                        }}
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
