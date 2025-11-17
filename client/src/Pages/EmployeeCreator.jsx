import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const createEmployee = async (employee) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error("Failed to create employee");
    return await res.json();
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

const EmployeeCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [favoriteBrandData, setFavoriteBrandData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, equipmentRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/favoriteBrands`),
          fetch(`${API_BASE_URL}/api/equipments`),
        ]);

        if (!brandsRes.ok || !equipmentRes.ok)
          throw new Error("Failed to fetch initial data");

        const [brands, equipments] = await Promise.all([
          brandsRes.json(),
          equipmentRes.json(),
        ]);

        setFavoriteBrandData(brands);
        setEquipmentData(equipments);
      } catch (err) {
        console.error(err);
        setError("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  const handleCreateEmployee = async (employee) => {
    setLoading(true);
    setError(null);
    try {
      await createEmployee(employee);
      navigate("/");
    } catch (err) {
      setError("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
      <EmployeeForm
          onCancel={() => navigate("/")}
          disabled={loading}
          onSave={handleCreateEmployee}
          favoriteBrands={favoriteBrandData}
          equipments={equipmentData}
      />
  );
};

export default EmployeeCreator;


