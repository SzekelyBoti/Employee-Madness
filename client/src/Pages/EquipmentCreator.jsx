import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";

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
 * @brief Component for creating new equipment records.
 *
 * This component provides a form for users to create new equipment records.
 * It handles form submission by sending data to the backend API, manages
 * loading states, error handling, and navigation upon successful creation.
 *
 * @returns {JSX.Element} The rendered equipment creation component.
 */
const EquipmentCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * @brief Handles the creation of a new equipment record.
   *
   * @param {Object} equipment - The equipment data to create.
   *
   * Sends a POST request to create a new equipment record with the provided
   * data. Handles loading states, error reporting, and navigation to the
   * home page upon successful creation.
   *
   * @async
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const handleCreateEquipment = async (equipment) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/equipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipment),
      });

      if (!res.ok) throw new Error("Failed to create equipment");

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error creating equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <EquipmentForm
            onCancel={() => navigate("/")}
            disabled={loading}
            onSave={handleCreateEquipment}
        />
      </div>
  );
};

export default EquipmentCreator;

