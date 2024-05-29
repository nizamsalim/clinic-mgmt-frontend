import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../Common/Constants";
import Loader from "../../Components/Loader";
import { useAlert } from "../../Common/AlertContext";

function DeptSpec() {
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isDeptLoading, setIsDeptLoading] = useState(false);
  const [isSpecLoading, setIsSpecLoading] = useState(false);
  //   const [departmentFilter, setDepartmentFilter] = useState("")

  const { showAlert } = useAlert();

  const populateDepartments = () => {
    axios
      .get(API.admin.getDepartments)
      .then(({ data }) => {
        if (data.success) {
          setDepartments(data.departments);
          setDepartmentId(data.departments[0].department_id);
        }
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  const populateSpecializations = () => {
    axios
      .get(API.admin.getSpecializations)
      .then(({ data }) => {
        if (data.success) {
          setSpecializations(data.specializations);
        }
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  useEffect(() => {
    populateDepartments();
    populateSpecializations();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createDepartment = (e) => {
    setIsDeptLoading(true);
    e.preventDefault();
    axios
      .post(API.admin.createDepartment, { department_name: department })
      .then(({ data }) => {
        if (!data.success) {
          return showAlert(data.error);
        }
        setIsDeptLoading(false);
        if (data.success) {
          populateDepartments();
          setDepartment("");
        }
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

  const createSpecialization = (e) => {
    e.preventDefault();
    setIsSpecLoading(true);
    axios
      .post(API.admin.createSpecialization, {
        specialization_name: specialization,
        department_id: departmentId,
      })
      .then(({ data }) => {
        setIsSpecLoading(false);
        if (data.success) {
          populateSpecializations();
          setSpecialization("");
        }
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };

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
      })
      .catch((err) => {
        return showAlert("Something went wrong");
      });
  };
  return (
    <div className="container">
      <div>
        <h3 className="text-center mt-4">Departments</h3>
        <div className="d-flex justify-items-center w-25">
          <input
            type="text"
            className="form-control"
            placeholder="Department name"
            aria-label="First name"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <button
            className="btn btn-success ms-3"
            onClick={createDepartment}
            disabled={department.trim().length === 0}
          >
            <Loader isLoading={isDeptLoading} label={"Submit"} />
          </button>
        </div>
        <table className="table w-50">
          <thead>
            <tr>
              <th scope="col">Department ID</th>
              <th scope="col">Department Name</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, ind) => {
              return (
                <tr key={ind}>
                  <th scope="row">{dept.department_id}</th>
                  <td>{dept.department_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-center mt-4">Specializations</h3>
        <div className="d-flex justify-items-center w-50">
          <input
            type="text"
            className="form-control me-3"
            placeholder="Specialization name"
            aria-label="First name"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <select
            id="department"
            className="form-select"
            onChange={(e) => setDepartmentId(e.target.value)}
          >
            {departments.map((dept, ind) => {
              return (
                <option key={ind} value={Number(dept.department_id)}>
                  {dept.department_name}
                </option>
              );
            })}
          </select>
          <button
            className="btn btn-success ms-3"
            onClick={createSpecialization}
            disabled={specialization.trim().length === 0}
          >
            <Loader isLoading={isSpecLoading} label={"Submit"} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="">Filter By Departments</label>
          <div className="d-flex">
            <select
              id="department"
              // value={departmentFilter}
              className="form-select w-25"
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
            <button
              className="btn btn-light ms-3"
              onClick={(e) => populateSpecializations()}
            >
              Reset
            </button>
          </div>
        </div>
        <table className="table w-50">
          <thead>
            <tr>
              <th scope="col">Department ID</th>
              <th scope="col">Specialization Name</th>
              <th scope="col">Department Name</th>
            </tr>
          </thead>
          <tbody>
            {specializations.map((spec, ind) => {
              return (
                <tr key={ind}>
                  <th scope="row">{spec.specialization_id}</th>
                  <td>{spec.specialization_name}</td>
                  <td>{spec.department_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeptSpec;
