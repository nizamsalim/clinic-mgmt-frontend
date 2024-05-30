import axios from "axios";
import React, { useEffect, useState } from "react";
import { API, ROUTES } from "../../Common/Constants";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../Components/ModalComponent";
import { useAlert } from "../../Common/AlertContext";
import DataLoader from "../../Components/DataLoader";

function PatientPage() {
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [specializationId, setSpecializationId] = useState("");
  const [date, setDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(false);
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const [show, setShow] = useState(false);
  const [modalBody, setModalBody] = useState("");

  const handleClose = () => {
    setShow(false);
    navigate(ROUTES.patient.getAppointments);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    setIsFetchingData(true);
    axios
      .get(API.admin.getDepartments)
      .then(({ data }) => {
        if (!data.success) {
          showAlert(data.error);
        }
        setDepartments(data.departments);
        setDepartmentId(data.departments[0].department_id);
        axios
          .get(
            `${API.admin.getSpecialization}/${data.departments[0].department_id}`
          )
          .then(({ data }) => {
            if (!data.success) {
              return showAlert(data.error);
            }
            setSpecializations(data.specializations);
            setSpecializationId(data.specializations[0].specialization_id);
            setIsFetchingData(false);
          })
          .catch((err) => {
            setIsFetchingData(false);
            return showAlert("Something went wrong");
          });
      })
      .catch((err) => {
        setIsFetchingData(false);
        showAlert("Something went wrong");
      });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDepartmentChange = (e) => {
    let dept_id = e.target.value;
    setDepartmentId(dept_id);
    axios
      .get(`${API.admin.getSpecialization}/${dept_id}`)
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setSpecializations(data.specializations);
        setSpecializationId(data.specializations[0].specialization_id);
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  const getAvailableDoctors = () => {
    setDoctors([]);
    setIsFetchingData(true);
    const data = {
      department_id: departmentId,
      specialization_id: specializationId,
      date,
    };
    axios
      .post(API.patient.getAvailableDoctors, data, { headers: { auth_token } })
      .then(({ data }) => {
        setIsFetchingData(false);
        if (!data.success) {
          return showAlert(data.error);
        }
        if (data.doctors.length === 0) {
          setError("No doctors available");
        }
        setDoctors(data.doctors);
      })
      .catch((err) => {
        setIsFetchingData(false);
        return showAlert("Something went wrong");
      });
  };

  const auth_token = localStorage.getItem("auth_token");
  const handleSearchSubmit = (e) => {
    setError("");
    getAvailableDoctors();
  };

  const handleBookAppointmentSubmit = (da_id) => {
    const data = { doctor_availability_id: da_id };
    axios
      .post(API.patient.createAppointment, data, { headers: { auth_token } })
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setModalBody(
          `Please note appointment number for future reference - ${data.appointmentId}`
        );
        handleShow();

        setDoctors(
          doctors.filter((doc) => doc.doctor_availability_id !== da_id)
        );
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  return (
    <div className="container">
      <ModalComponent
        body={modalBody}
        handleClose={handleClose}
        show={show}
        title={"Appointment number"}
      />
      <h3 className="text-center mt-3">Book Appointment</h3>
      <div className="row mt-4">
        <div className="col-md-3">
          <label htmlFor="inputState" className="form-label">
            Department
          </label>
          <select
            id="department"
            className="form-select"
            onChange={handleDepartmentChange}
          >
            {departments.map((dept, ind) => {
              return (
                <option key={ind} value={Number(dept.department_id)}>
                  {dept.department_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="inputState" className="form-label">
            Specialization
          </label>
          <select
            id="specialization"
            className="form-select"
            onChange={(e) => setSpecializationId(e.target.value)}
          >
            {specializations &&
              specializations.map((spec, ind) => {
                return (
                  <option key={ind} value={Number(spec.specialization_id)}>
                    {spec.specialization_name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-start flex-column">
          <label htmlFor="inputState" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="w-100"
            style={{
              height: "34px",
              borderRadius: "3px",
              border: "solid 0.2px black #111",
            }}
            id=""
            value={date}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              const d = new Date();
              if (selectedDate < d) {
                return showAlert("Select valid date");
              }
              setDate(e.target.value);
            }}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-primary w-50"
            style={{ height: "40px" }}
            onClick={handleSearchSubmit}
            disabled={!date}
          >
            Search
          </button>
        </div>
      </div>
      <DataLoader isFetchingData={isFetchingData} />
      {doctors.length !== 0 ? (
        <table className="table mt-4">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Doctor</th>
              <th scope="col">Department</th>
              <th scope="col">Specialization</th>
              <th scope="col">Book</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doctor, ind) => {
              return (
                <tr key={ind}>
                  <td>{new Date(doctor.date).toDateString()}</td>
                  <td>{doctor.start_time}</td>
                  <td>{doctor.end_time}</td>
                  <th scope="row">{doctor.name}</th>
                  <td>{doctor.department_name}</td>
                  <td>{doctor.specialization_name}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={(e) =>
                        handleBookAppointmentSubmit(
                          doctor.doctor_availability_id
                        )
                      }
                    >
                      Book
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h4 className="text-center mt-3">{error}</h4>
      )}
    </div>
  );
}

export default PatientPage;
