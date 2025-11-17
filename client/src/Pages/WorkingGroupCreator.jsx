import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

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

const CreateWorkingGroup = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateWorkingGroup = async () => {
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

