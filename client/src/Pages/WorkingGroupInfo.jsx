import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
 * @brief Component for displaying detailed information about a specific working group.
 *
 * This component fetches and displays detailed information for a working group
 * identified by its ID from the URL parameters. It shows the group name and
 * a list of employees belonging to that group.
 *
 * @returns {JSX.Element} The rendered working group information component.
 */
const WorkingGroupInfo = () => {
  const { id } = useParams();
  const [workingGroup, setWorkingGroup] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * @brief Fetches working group data from the API when the component mounts or ID changes.
   *
   * This effect runs whenever the `id` parameter changes, fetching detailed
   * information about the specified working group from the backend API.
   * It extracts and stores both the group data and its employee list separately.
   *
   * @effect
   * @dependencies {string} id - The working group ID from URL parameters.
   */
  useEffect(() => {
    const fetchWorkingGroup = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/workingGroup/${id}`);
        if (!res.ok) {
          throw new Error(`Error fetching working group: ${res.statusText}`);
        }
        const data = await res.json();
        setWorkingGroup(data);
        setEmployees(data.employees || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingGroup();
  }, [id]);

  // Display loading state
  if (loading) return <p>Loading working group...</p>;

  // Display error state
  if (error) return <p>Error: {error}</p>;

  return (
      <div className="WorkGroupInfo">
        {workingGroup && (
            <div>
              <h1>{workingGroup.name}</h1>
              {employees.length > 0 ? (
                  <ul>
                    {employees.map((employee) => (
                        <li key={employee._id}>{employee.name}</li>
                    ))}
                  </ul>
              ) : (
                  <p>No employees in this working group.</p>
              )}
            </div>
        )}
      </div>
  );
};

export default WorkingGroupInfo;

