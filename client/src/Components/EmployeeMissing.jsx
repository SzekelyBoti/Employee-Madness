import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const API_URL = process.env.REACT_APP_API_URL || "";

const fetchMissingEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}/api/missing-employees`);
    if (!response.ok) throw new Error("Failed to fetch missing employees");
    return await response.json();
  } catch (error) {
    console.error("Error fetching missing employees:", error);
    return [];
  }
};

const MissingEmployees = () => {
  const [loading, setLoading] = useState(true);
  const [missingEmployees, setMissingEmployees] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const employees = await fetchMissingEmployees();
      setMissingEmployees(employees);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
      <div>
        <h2>Missing Employees</h2>
        {missingEmployees.length > 0 ? (
            <EmployeeTable employees={missingEmployees} />
        ) : (
            <p>No missing employees found 🎉</p>
        )}
      </div>
  );
};

export default MissingEmployees;

