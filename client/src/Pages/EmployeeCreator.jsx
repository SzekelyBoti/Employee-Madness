import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";

const createEmployee = (employee) => {
  return fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((res) => res.json());
};

const EmployeeCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchFavoriteBrandsData = () => {
    fetch("/api/favoriteBrands")
      .then((res) => res.json())
      .then((data) => {
        setFavoriteBrandData(data);
      })
      .catch((error) => {
        console.error("Error fetching favoriteBrand data:", error);
      });
  };
  const [favoriteBrandData, setFavoriteBrandData] = useState([]);
  const fetchEquipmentData = () => {
    fetch("/api/equipments")
      .then((res) => res.json())
      .then((data) => {
        setEquipmentData(data);
      })
      .catch((error) => {
        console.error("Error fetching equipment data:", error);
      });
  };

  const [equipmentData, setEquipmentData] = useState([]);

  const handleCreateEmployee = (employee) => {
    setLoading(true);

    createEmployee(employee).then(() => {
      setLoading(false);
      navigate("/");
    });
  };
  fetchFavoriteBrandsData();
  fetchEquipmentData();

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
