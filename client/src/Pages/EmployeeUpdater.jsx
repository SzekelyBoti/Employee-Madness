import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import Loading from "../Components/Loading";

const EmployeeUpdater = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);

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

  useEffect(() => {
    setEmployeeLoading(true);
    fetch(`/api/employees/${id}`)
      .then((res) => res.json())
      .then((employee) => {
        setEmployee(employee);
        setEmployeeLoading(false);
      });

    fetchEquipmentData();

    fetchFavoriteBrandsData();
  }, [id]);

  const handleUpdateEmployee = (updatedEmployee) => {
    setUpdateLoading(true);
    fetch(`/api/employees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEmployee),
    })
      .then((res) => res.json())
      .then(() => {
        setUpdateLoading(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        setUpdateLoading(false);
      });
  };

  if (employeeLoading) {
    return <Loading />;
  }

  return (
    <div>
      <EmployeeForm
        employee={employee}
        onSave={handleUpdateEmployee}
        disabled={updateLoading}
        onCancel={() => navigate("/")}
        favoriteBrands={favoriteBrandData}
        equipments={equipmentData}
      />
    </div>
  );
};

export default EmployeeUpdater;
