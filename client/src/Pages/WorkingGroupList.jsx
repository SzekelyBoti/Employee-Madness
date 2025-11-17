import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const WorkingGroupsList = () => {
  const [workingGroups, setWorkingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading working groups...</p>;
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

