import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

/**
 * @brief Base URL for API requests, configurable via environment variable.
 *
 * @constant API_URL
 * @type {string}
 *
 * Uses the REACT_APP_API_URL environment variable if set, otherwise defaults
 * to an empty string (relative URLs). This allows deployment flexibility
 * across different environments.
 */
const API_URL = process.env.REACT_APP_API_URL || "";

/**
 * @brief Fetches a list of missing employees from the backend API.
 *
 * Missing employees are those who have been marked as not present.
 * This function retrieves the list from the dedicated missing employees endpoint.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of missing employee objects.
 * @throws {Error} If the API request fails or returns a non-OK response.
 */
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

/**
 * @brief Component for displaying a list of missing employees.
 *
 * This component fetches and displays employees who are currently marked as
 * missing (not present). It provides a clean interface to view which
 * employees are absent, with a celebratory message when all employees are present.
 *
 * @returns {JSX.Element} The rendered missing employees component.
 */
const MissingEmployees = () => {
  const [loading, setLoading] = useState(true);
  const [missingEmployees, setMissingEmployees] = useState([]);

  /**
   * @brief Fetches missing employee data when the component mounts.
   *
   * Loads the list of missing employees from the backend API and updates
   * the component state. Handles the loading state transition.
   *
   * @effect
   */
  useEffect(() => {
    const loadData = async () => {
      const employees = await fetchMissingEmployees();
      setMissingEmployees(employees);
      setLoading(false);
    };
    loadData();
  }, []);

  // Display loading state while fetching data
  if (loading) {
    return <Loading />;
  }

  return (
      <div>
        <h2>Missing Employees</h2>
        {missingEmployees.length > 0 ? (
            // Display missing employees in a table
            <EmployeeTable employees={missingEmployees} />
        ) : (
            // Show celebratory message when no employees are missing
            <p>No missing employees found 🎉</p>
        )}
      </div>
  );
};

export default MissingEmployees;

