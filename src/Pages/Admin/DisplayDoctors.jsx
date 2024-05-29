import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { API, ROUTES } from "../../Common/Constants";
import { Link } from "react-router-dom";
import { useAlert } from "../../Common/AlertContext";
import { Button, Modal } from "react-bootstrap";

function DisplayDoctors() {
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [search, setSearch] = useState("");
  const [flaggedDoctor, setFlaggedDoctor] = useState({
    name: "",
    doctor_id: "",
  });

  const { showAlert } = useAlert();

  const getDoctors = () => {
    axios
      .get(API.admin.getDoctors)
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setDoctors(data.doctors);
      })
      .catch((err) => showAlert("Something went wrong"));
  };
  const initialPopulate = () => {
    axios
      .get(API.admin.getDepartments)
      .then(({ data }) => {
        if (data.success) {
          setDepartments(data.departments);
          axios
            .get(API.admin.getSpecializations)
            .then(({ data }) => {
              if (data.success) {
                setSpecializations(data.specializations);
              }
            })
            .catch((err) => showAlert("Something went wrong"));
        }
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    getDoctors();
    initialPopulate();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`${API.admin.deleteDoctor}/${flaggedDoctor.doctor_id}`)
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        getDoctors();
        handleClose();
      })
      .catch((err) => {
        handleClose();
        return showAlert("Something went wrong");
      });
  };

  const handleDepartmentChange = (e) => {
    console.log(e.target.value);
    setDepartment(e.target.value);
    axios
      .get(`${API.admin.getDoctorsByDepartment}/${e.target.value}`)
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          showAlert(data.error);
        }
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value);
    axios
      .get(`${API.admin.getDoctorsBySpecialization}/${e.target.value}`)
      .then(({ data }) => {
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          showAlert(data.error);
        }
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  const getDoctor = (val) => {
    axios
      .get(`${API.admin.getDoctorByName}/${val}`)
      .then((res) => {
        setDoctors(res.data.doctors);
      })
      .catch((err) => showAlert("Something went wrong"));
  };

  const handleSearch = (val) => {
    setSearch(val);
    if (val.trim().length === 0) {
      getDoctors();
    } else {
      getDoctor(val);
    }
  };

  const clearFilters = (e) => {
    e.preventDefault();
    setSpecialization(1);
    setDepartment(1);
    getDoctors();
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
          Are you sure you want to delete the record of{" "}
          <strong>{flaggedDoctor.name}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-end mt-4">
        <Link to={ROUTES.admin.createDoctor} className="btn btn-success">
          Create Doctor
        </Link>
      </div>
      <div className="d-flex align-items-end">
        <div className="col-md-3 me-4">
          <label htmlFor="inputState" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control "
            placeholder="Search name"
            id="inputEmail4"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3 me-4">
          <label htmlFor="inputState" className="form-label">
            Department
          </label>
          <select
            id="department"
            value={department}
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
            id="department"
            value={specialization}
            className="form-select"
            onChange={handleSpecializationChange}
          >
            {specializations.map((spec, ind) => {
              return (
                <option key={ind} value={Number(spec.specialization_id)}>
                  {spec.specialization_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-3 ms-3">
          <button className="btn btn-light" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>
      {doctors.length === 0 ? (
        <h4 className="text-center mt-3">No Doctors found</h4>
      ) : (
        <div>
          <h2 className="text-center mt-3">Doctors</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">User ID</th>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">License Number</th>
                <th scope="col">Salary</th>
                <th scope="col">Department</th>
                <th scope="col">Specialization</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, ind) => {
                return (
                  <tr key={ind}>
                    <th scope="row">{doctor.user_id}</th>
                    <td>{doctor.name}</td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.license_number}</td>
                    <td>{doctor.salary}</td>
                    <td>{doctor.department_name}</td>
                    <td>{doctor.specialization_name}</td>
                    <td>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={(e) => {
                          handleShow();
                          setFlaggedDoctor({
                            name: doctor.name,
                            doctor_id: doctor.user_id,
                          });
                        }}
                      >
                        <i
                          className="fa-solid fa-trash"
                          style={{ color: "white" }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DisplayDoctors;
