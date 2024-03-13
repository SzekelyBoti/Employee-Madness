import { useState } from "react";

const EmployeeForm = ({
  onSave,
  disabled,
  employee,
  onCancel,
  equipments,
  favoriteBrands,
}) => {
  const [name, setName] = useState(employee?.name ?? "");
  const [level, setLevel] = useState(employee?.level ?? "");
  const [position, setPosition] = useState(employee?.position ?? "");
  const [selectedEquipment, setSelectedEquipment] = useState({
    id: employee?.equipment?.id ?? "",
    name: employee?.equipment?.name ?? "",
  });
  const [selectedFavoriteBrand, setFavoriteBrand] = useState({
    id: employee?.favoriteBrand?.id ?? "",
    name: employee?.favoriteBrand?.name ?? "",
  });

  const onSubmit = (e) => {
    e.preventDefault();

    const employeeData = {
      name,
      level,
      position,
      favoriteBrand: selectedFavoriteBrand,
      equipment: selectedEquipment,
    };

    if (employee) {
      return onSave({
        ...employee,
        ...employeeData,
        name,
        level,
        position,
      });
    } else {
      onSave(employeeData);
    }
    return onSave({
      name,
      level,
      position,
    });
  };

  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="level">Level:</label>
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          name="level"
          id="level"
        />
      </div>

      <div className="control">
        <label htmlFor="position">Position:</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          name="position"
          id="position"
        />
      </div>
      <div className="control">
        <label htmlFor="favoriteBrand">Select Favorite Brand:</label>
        <select
          value={selectedFavoriteBrand.id}
          onChange={(e) =>
            setFavoriteBrand({
              id: e.target.value,
              name: e.target.selectedOptions[0].text,
            })
          }
          name="favoriteBrand"
          id="favoriteBrand"
        >
          <option value="">-- Select Favorite Brand --</option>
          {favoriteBrands.map((favoriteBrand) => (
            <option key={favoriteBrand._id} value={favoriteBrand._id}>
              {favoriteBrand.name}
            </option>
          ))}
        </select>
      </div>
      <div className="control">
        <label htmlFor="equipment">Select Equipment:</label>
        <select
          value={selectedEquipment.id}
          onChange={(e) =>
            setSelectedEquipment({
              id: e.target.value,
              name: e.target.selectedOptions[0].text,
            })
          }
          name="equipment"
          id="equipment"
        >
          <option value="">-- Select Equipment --</option>
          {equipments.map((equipment) => (
            <option key={equipment._id} value={equipment._id}>
              {equipment.name}
            </option>
          ))}
        </select>
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Update Employee" : "Create Employee"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
