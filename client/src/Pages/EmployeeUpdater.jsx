import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

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
 * @brief Component for updating existing employee records.
 *
 * This component fetches an existing employee record along with related
 * reference data (favorite brands and equipment), displays it in a form
 * for editing, and handles the submission of updated data to the backend API.
 * It uses parallel data fetching for optimal performance and manages
 * multiple loading states and error handling.
 *
 * @returns {JSX.Element} The rendered employee updater component.
 */
const EmployeeUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [favoriteBrandData, setFavoriteBrandData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [error, setError] = useState(null);

  /**
   * @brief Fetches employee data and related reference data in parallel.
   *
   * Uses Promise.all to fetch three sets of data simultaneously:
   * 1. The specific employee record to edit
   * 2. All favorite brands for dropdown selection
   * 3. All equipment for dropdown selection
   *
   * This parallel fetching improves performance compared to sequential requests.
   *
   * @effect
   * @dependencies {string} id - The employee ID from URL parameters.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setEmployeeLoading(true);

        // Fetch all data in parallel for better performance
        const [empRes, brandsRes, equipRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/employee/${id}`),
          fetch(`${API_BASE_URL}/api/favoriteBrands`),
          fetch(`${API_BASE_URL}/api/equipments`),
        ]);

        if (!empRes.ok) throw new Error("Failed to fetch employee");
        if (!brandsRes.ok) throw new Error("Failed to fetch favorite brands");
        if (!equipRes.ok) throw new Error("Failed to fetch equipments");

        // Parse all JSON responses in parallel
        const [emp, brands, equipments] = await Promise.all([
          empRes.json(),
          brandsRes.json(),
          equipRes.json(),
        ]);

        setEmployee(emp);
        setFavoriteBrandData(brands);
        setEquipmentData(equipments);
      } catch (err) {
        console.error(err);
        setError("Failed to load employee data");
      } finally {
        setEmployeeLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /**
   * @brief Sends updated employee data to the API.
   *
   * @param {Object} updatedEmployee - The updated employee data to save.
   *
   * Makes a PATCH request to update the employee record with the provided data.
   * Handles loading states, error reporting, and navigation upon success.
   *
   * @async
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const handleUpdateEmployee = async (updatedEmployee) => {
    setUpdateLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });
      if (!res.ok) throw new Error("Failed to update employee");

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error updating employee");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Display loading state while fetching data
  if (employeeLoading) return <Loading />;

  // Display error state if data fetching failed
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Render the employee form with all fetched data
  return (
      <EmployeeForm
          employee={employee}
          onSave={handleUpdateEmployee}
          disabled={updateLoading}
          onCancel={() => navigate("/")}
          favoriteBrands={favoriteBrandData}
          equipments={equipmentData}
      />
  );
};

export default EmployeeUpdater;

