import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const EmployeeUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [favoriteBrandData, setFavoriteBrandData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setEmployeeLoading(true);

        const [empRes, brandsRes, equipRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/employee/${id}`),
          fetch(`${API_BASE_URL}/api/favoriteBrands`),
          fetch(`${API_BASE_URL}/api/equipments`),
        ]);

        if (!empRes.ok) throw new Error("Failed to fetch employee");
        if (!brandsRes.ok) throw new Error("Failed to fetch favorite brands");
        if (!equipRes.ok) throw new Error("Failed to fetch equipments");

        const [emp, brands, equipments] = await Promise.all([
          empRes.json(),
          brandsRes.json(),
          equipRes.json(),
        ]);

        setEmployee(emp);
        setFavoriteBrandData(brands);
        setEquipmentData(equipments);
      } catch (err) {
        console.error(err);
        setError("Failed to load employee data");
      } finally {
        setEmployeeLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateEmployee = async (updatedEmployee) => {
    setUpdateLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });
      if (!res.ok) throw new Error("Failed to update employee");

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error updating employee");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (employeeLoading) return <Loading />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
      <EmployeeForm
          employee={employee}
          onSave={handleUpdateEmployee}
          disabled={updateLoading}
          onCancel={() => navigate("/")}
          favoriteBrands={favoriteBrandData}
          equipments={equipmentData}
      />
  );
};

export default EmployeeUpdater;

