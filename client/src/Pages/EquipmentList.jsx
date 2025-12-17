import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EquipmentTable from "../Components/EquipmentTable/EquipmentTable";

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
 * @brief Component for displaying and managing a list of equipment.
 *
 * This component fetches equipment data from the backend API, displays it
 * in a table format, and provides functionality for deleting equipment
 * records. It handles loading states and error conditions appropriately.
 *
 * @returns {JSX.Element} The rendered equipment list component.
 */
const EquipmentList = () => {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);

  /**
   * @brief Fetches equipment data from the API.
   *
   * Retrieves all equipment records from the backend and updates the
   * component state. Handles network errors and updates loading state.
   *
   * @async
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const fetchEquipments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/equipments`);
      if (!res.ok) throw new Error("Failed to fetch equipments");
      const data = await res.json();
      setEquipments(data);
    } catch (err) {
      console.error(err);
      setError("Error loading equipments");
    } finally {
      setLoading(false);
    }
  };

  /**
   * @brief Deletes an equipment record from the backend and updates the UI.
   *
   * @param {string} id - The ID of the equipment to delete.
   *
   * Sends a DELETE request to remove the specified equipment record,
   * then updates the local state to reflect the deletion. Handles errors
   * that may occur during the deletion process.
   *
   * @async
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/equipments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete equipment");

      // Update local state by removing the deleted equipment
      setEquipments((prev) => prev.filter((eq) => eq._id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting equipment");
    }
  };

  /**
   * @brief Fetches equipment data when the component mounts.
   *
   * @effect
   */
  useEffect(() => {
    fetchEquipments();
  }, []);

  // Display loading state
  if (loading) return <Loading />;

  // Display error state
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Render the equipment table with data and delete handler
  return <EquipmentTable equipments={equipments} onDelete={handleDelete} />;
};

export default EquipmentList;

