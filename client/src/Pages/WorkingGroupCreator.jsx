import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
 * @brief Sends a request to create a new working group in the backend.
 *
 * @param {Object} workingGroup - The working group data to create.
 * @param {string} workingGroup.name - The name of the working group.
 *
 * @returns {Promise<Object>} A promise that resolves to the created working group data.
 * @throws {Error} If the API request fails or returns a non-OK response.
 *
 * This function makes a POST request to the working groups API endpoint
 * with the provided working group data in JSON format.
 */
const createWorkingGroup = async (workingGroup) => {
  const res = await fetch(`${API_BASE_URL}/api/workingGroup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workingGroup),
  });

  if (!res.ok) {
    throw new Error(`Failed to create working group: ${res.statusText}`);
  }

  return res.json();
};

/**
 * @brief Component for creating a new working group.
 *
 * This component provides a form for users to create a new working group.
 * It includes validation, loading states, and navigation after successful creation.
 *
 * @returns {JSX.Element} The rendered working group creation form component.
 */
const CreateWorkingGroup = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * @brief Handles the creation of a new working group.
   *
   * Validates the input, sends the creation request to the API, and navigates
   * to the home page upon success. Shows appropriate alerts for validation
   * errors or API failures.
   *
   * @async
   */
  const handleCreateWorkingGroup = async () => {
    // Validate input
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await createWorkingGroup({ name });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error creating working group");
    } finally {
      setLoading(false);
    }
  };

  /**
   * @brief Form submission handler.
   *
   * @param {Event} e - The form submission event.
   *
   * Prevents default form submission behavior and triggers the working
   * group creation process.
   */
  const onSubmit = (e) => {
    e.preventDefault();
    handleCreateWorkingGroup();
  };

  return (
      <form className="workingGroupForm" onSubmit={onSubmit}>
        <div className="control">
          <label htmlFor="name">Name:</label>
          <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Working Group"}
          </button>
        </div>
      </form>
  );
};

export default CreateWorkingGroup;

