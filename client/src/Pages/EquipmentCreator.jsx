import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const EquipmentCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

