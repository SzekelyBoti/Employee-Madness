import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EquipmentTable from "../Components/EquipmentTable/EquipmentTable";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const EquipmentList = () => {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/equipments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete equipment");

      setEquipments((prev) => prev.filter((eq) => eq._id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting equipment");
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return <EquipmentTable equipments={equipments} onDelete={handleDelete} />;
};

export default EquipmentList;

