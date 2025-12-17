import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";
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
 * @brief Component for updating existing equipment records.
 *
 * This component fetches an existing equipment record by ID, displays it
 * in a form for editing, and handles the submission of updated data to
 * the backend API. It manages loading states, error handling, and
 * navigation after successful updates.
 *
 * @returns {JSX.Element} The rendered equipment updater component.
 */
const EquipmentUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * @brief Fetches equipment data from the API.
   *
   * Retrieves the equipment record with the specified ID from the backend.
   * Updates the component state with the fetched data or sets an error
   * if the request fails.
   *
   * @async
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/equipments/${id}`);
      if (!res.ok) throw new Error("Failed to fetch equipment");
      const data = await res.json();
      setEquipment(data);
    } catch (err) {
      console.error(err);
      setError("Error loading equipment");
    } finally {
      setLoading(false);
    }
  };

  /**
   * @brief Sends updated equipment data to the API.
   *
   * @param {Object} updatedEquipment - The updated equipment data to save.
   *
   * Makes a PATCH request to update the equipment record with the provided data.
   * Handles loading states, error reporting, and navigation upon success.
   *
   * @async
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const handleUpdateEquipment = async (updatedEquipment) => {
    setUpdateLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/equipments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEquipment),
      });
      if (!res.ok) throw new Error("Failed to update equipment");
      navigate("/"); // Redirect after successful update
    } catch (err) {
      console.error(err);
      setError("Error updating equipment");
    } finally {
      setUpdateLoading(false);
    }
  };

  /**
   * @brief Fetches equipment data when component mounts or ID changes.
   *
   * @effect
   * @dependencies {string} id - The equipment ID from URL parameters.
   */
  useEffect(() => {
    fetchEquipment();
  }, [id]);

  // Display loading state
  if (loading) return <Loading />;

  // Display error state
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Render the equipment form with fetched data
  return (
      <EquipmentForm
          equipment={equipment}
          onSave={handleUpdateEquipment}
          disabled={updateLoading}
          onCancel={() => navigate("/")}
      />
  );
};

export default EquipmentUpdater;

