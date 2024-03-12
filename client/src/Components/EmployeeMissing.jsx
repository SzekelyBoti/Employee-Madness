import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchMissingEmployees = () => {
  return fetch("/api/missing-employees").then((res) => res.json());
};

const MissingEmployees = () => {
  const [loading, setLoading] = useState(true);
  const [missingEmployees, setMissingEmployees] = useState(null);

  useEffect(() => {
    fetchMissingEmployees().then((employees) => {
      setLoading(false);
      setMissingEmployees(employees);
    });
  }, []);
  console.log(missingEmployees);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Missing Employees</h2>
      <EmployeeTable employees={missingEmployees} />
    </div>
  );
};

export default MissingEmployees;
