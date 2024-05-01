import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { API, ROUTES } from "../../Common/Constants";
import { Link } from "react-router-dom";

function DisplayDoctors() {
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const getDoctors = () => {
    axios.get(API.admin.getDoctors).then(({ data }) => {
      if (!data.success) {
        return alert(data.error);
      }
      setDoctors(data.doctors);
    });
  };
  const initialPopulate = () => {
    axios.get(API.admin.getDepartments).then(({ data }) => {
      if (data.success) {
        setDepartments(data.departments);
        axios
          .get(API.admin.getSpecializations)
          .then(({ data }) => {
            if (data.success) {
              setSpecializations(data.specializations);
            }
          })
          .catch((err) => {
            return alert("Something went wrong");
          });
      }
    });
  };
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    getDoctors();
    initialPopulate();
    return () => {};
  }, []);

  const handleDelete = (user_id) => {
    axios
      .post(API.admin.deleteDoctor, { user_id })
      .then(({ data }) => {
        if (!data.success) {
          return alert(data.error);
        }
        getDoctors();
      })
      .catch((err) => {
        return alert("Something went wrong");
      });
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    axios
      .get(`${API.admin.getDoctorsByDepartment}/${e.target.value}`)
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          setDoctors(data.doctors);
        }
      })
      .catch((err) => {
        return alert("Something went wrong");
      });
  };

  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value);
    axios
      .get(`${API.admin.getDoctorsBySpecialization}/${e.target.value}`)
      .then(({ data }) => {
        if (data.success) {
          setDoctors(data.doctors);
        }
      })
      .catch((err) => {
        return alert("Something went wrong");
      });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-4">
        <Link to={ROUTES.admin.createDoctor} className="btn btn-success">
          Create Doctor
        </Link>
      </div>
      <div className="d-flex align-items-end">
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
          <button className="btn btn-light" onClick={(e) => getDoctors()}>
            Clear filters
          </button>
        </div>
      </div>
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
            <th scope="col">Update</th>
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
                  {" "}
                  <button className="btn btn-warning">Update</button>{" "}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleDelete(doctor.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayDoctors;
