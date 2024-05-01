import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { API, ROUTES } from "../../Common/Constants";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";

function CreateDoctor() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [salary, setSalary] = useState(undefined);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [departmentId, setDepartmentId] = useState(0);
  const [specializationId, setSpecializationId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(API.admin.getDepartments)
      .then(({ data }) => {
        if (!data.success) {
          alert(data.error);
        }
        setDepartments(data.departments);
        setDepartmentId(data.departments[0].department_id);
        // console.log(data.departments[0].department_id);
        axios
          .get(
            `${API.admin.getSpecialization}/${data.departments[0].department_id}`
          )
          .then(({ data }) => {
            if (!data.success) {
              return alert(data.error);
            }
            setSpecializations(data.specializations);
            setSpecializationId(data.specializations[0].specialization_id);
          })
          .catch((err) => {
            return alert("Something went wrong");
          });
      })
      .catch((err) => {
        return alert("Something went wrong");
      });

    return () => {};
  }, []);

  const handleDepartmentChange = (e) => {
    let dept_id = e.target.value;
    setDepartmentId(dept_id);
    axios
      .get(`${API.admin.getSpecialization}/${dept_id}`)
      .then(({ data }) => {
        if (!data.success) {
          return alert(data.error);
        }
        setSpecializations(data.specializations);
        setSpecializationId(data.specializations[0].specialization_id);
      })
      .catch((err) => {
        return alert("Something went wrong");
      });
  };

  const handleCreateDoctorSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      name,
      phone,
      username,
      password,
      salary,
      license_number: licenseNumber,
      department_id: departmentId,
      specialization_id: specializationId,
    };
    // console.log(data);
    axios
      .post(API.admin.createDoctor, data)
      .then(({ data }) => {
        setIsLoading(false);
        if (!data.success) {
          alert(data.error);
        } else {
          navigate(ROUTES.admin.getDoctors);
        }
      })
      .catch((err) => {
        return alert("Something went wrong");
      });
  };

  return (
    <div className="container w-50 mt-5">
      <h2 className="text-center mb-3">Create Doctor Record</h2>
      <form className="row g-3" onSubmit={handleCreateDoctorSubmit}>
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword4"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Salary
          </label>
          <input
            type="number"
            className="form-control"
            id="inputEmail4"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            License Number
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword4"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </div>

        <div className="col-md-6">
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
                <option value={Number(dept.department_id)} key={ind}>
                  {dept.department_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-6">
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
                  <option value={Number(spec.specialization_id)} key={ind}>
                    {spec.specialization_name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="col-12 d-flex justify-content-center mt-5">
          <button
            type="submit"
            className="btn btn-primary w-50"
            disabled={
              !(
                name &&
                phone &&
                username &&
                password &&
                salary &&
                licenseNumber
              )
            }
          >
            <Loader isLoading={isLoading} label={"Submit"} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateDoctor;
