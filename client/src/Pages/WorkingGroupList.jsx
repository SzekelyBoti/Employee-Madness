import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * @brief Base URL for API requests, configurable via environment variable.
 *
 * @constant API_BASE_URL
 * @type {string}
 *
 * Uses the REACT_APP_API_URL environment variable if set, otherwise defaults
 * to an empty string (relative URLs). This allows for flexible deployment
 * across different environments (development, staging, production).
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/**
 * @brief Component for displaying a list of working groups.
 *
 * This component fetches and displays all working groups from the backend API.
 * It provides a table view with each group's name and a link to detailed information.
 *
 * @returns {JSX.Element} The rendered working groups list component.
 */
const WorkingGroupsList = () => {
  const [workingGroups, setWorkingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * @brief Fetches working groups data from the API on component mount.
   *
   * This effect runs once when the component mounts, fetching the list of
   * working groups from the backend API. It handles loading states and
   * error conditions appropriately.
   */
  useEffect(() => {
    const fetchWorkingGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/workingGroups/`);
        if (!res.ok) {
          throw new Error(`Error fetching working groups: ${res.statusText}`);
        }
        const data = await res.json();
        setWorkingGroups(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingGroups();
  }, []);

  // Display loading state
  if (loading) return <p>Loading working groups...</p>;

  // Display error state
  if (error) return <p>Error: {error}</p>;

  return (
      <div className="WorkingGroupsTable">
        {workingGroups.length === 0 ? (
            <p>No working groups available.</p>
        ) : (
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {workingGroups.map((group) => (
                  <tr key={group._id}>
                    <td>{group.name}</td>
                    <td>
                      <Link to={`/working-group-info/${group._id}`}>
                        <button type="button">Info</button>
                      </Link>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default WorkingGroupsList;
