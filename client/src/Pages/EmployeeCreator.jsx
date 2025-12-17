import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";

/**
 * @brief Base URL for API requests, configurable via environment variable.
 *
 * @constant API_BASE_URL
 * @type {string}
 *
 * Uses the REACT_APP_API_URL environment variable if set, otherwise defaults
 * to an empty string (relative URLs). This allows deployment flexibility
 * across different environments.
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/**
 * @brief Sends a request to create a new employee in the backend.
 *
 * @param {Object} employee - The employee data to create.
 * @param {string} employee.name - The employee's name.
 * @param {number} employee.level - The employee's level.
 * @param {string} employee.position - The employee's position.
 * @param {string} employee.favoriteBrand - The employee's favorite brand (optional).
 * @param {Array<string>} employee.equipment - Array of equipment IDs assigned to the employee (optional).
 *
 * @returns {Promise<Object>} A promise that resolves to the created employee data.
 * @throws {Error} If the API request fails or returns a non-OK response.
 *
 * This function makes a POST request to the employees API endpoint
 * with the provided employee data in JSON format.
 */
const createEmployee = async (employee) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error("Failed to create employee");
    return await res.json();
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

/**
 * @brief Component for creating new employee records.
 *
 * This component provides a form for users to create new employee records.
 * It pre-fetches reference data (favorite brands and equipment) for dropdowns,
 * handles form submission by sending data to the backend API, manages loading
 * states, error handling, and navigation upon successful creation.
 *
 * @returns {JSX.Element} The rendered employee creation component.
 */
const EmployeeCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [favoriteBrandData, setFavoriteBrandData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [error, setError] = useState(null);

  /**
   * @brief Fetches reference data for form dropdowns.
   *
   * Fetches favorite brands and equipment data in parallel for optimal performance.
   * These datasets populate the dropdown selections in the employee creation form.
   *
   * @effect
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both datasets in parallel
        const [brandsRes, equipmentRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/favoriteBrands`),
          fetch(`${API_BASE_URL}/api/equipments`),
        ]);

        if (!brandsRes.ok || !equipmentRes.ok)
          throw new Error("Failed to fetch initial data");

        // Parse both JSON responses in parallel
        const [brands, equipments] = await Promise.all([
          brandsRes.json(),
          equipmentRes.json(),
        ]);

        setFavoriteBrandData(brands);
        setEquipmentData(equipments);
      } catch (err) {
        console.error(err);
        setError("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  /**
   * @brief Handles the creation of a new employee record.
   *
   * @param {Object} employee - The employee data to create.
   *
   * Sends a POST request to create a new employee record with the provided
   * data. Handles loading states, error reporting, and navigation to the
   * home page upon successful creation.
   *
   * @async
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const handleCreateEmployee = async (employee) => {
    setLoading(true);
    setError(null);
    try {
      await createEmployee(employee);
      navigate("/");
    } catch (err) {
      setError("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  // Display error state if data fetching failed
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // Render the employee form with reference data
  return (
      <EmployeeForm
          onCancel={() => navigate("/")}
          disabled={loading}
          onSave={handleCreateEmployee}
          favoriteBrands={favoriteBrandData}
          equipments={equipmentData}
      />
  );
};

export default EmployeeCreator;


