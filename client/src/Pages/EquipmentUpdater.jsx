import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";
import Loading from "../Components/Loading";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const EquipmentUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

