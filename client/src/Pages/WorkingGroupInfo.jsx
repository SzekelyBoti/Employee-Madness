import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const WorkingGroupInfo = () => {
  const { id } = useParams();
  const [workingGroup, setWorkingGroup] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading working group...</p>;
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

