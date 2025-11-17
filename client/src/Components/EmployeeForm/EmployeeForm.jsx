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
  const [selectedEquipment, setSelectedEquipment] = useState(
      employee?.equipment?.[0]?._id ?? ""
  );
  const [selectedFavoriteBrand, setFavoriteBrand] = useState(
      employee?.favoriteBrand?._id ?? ""
  );

  const onSubmit = (e) => {
    e.preventDefault();

    const employeeData = {
      name,
      level,
      position,
      favoriteBrand: selectedFavoriteBrand,
      equipment: selectedEquipment ? [selectedEquipment] : [],
    };

    if (employee) {
      onSave({ ...employee, ...employeeData });
    } else {
      onSave(employeeData);
    }
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
              required
              disabled={disabled}
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
          <label htmlFor="favoriteBrand">Favorite Brand:</label>
          <select
              value={selectedFavoriteBrand}
              onChange={(e) => setFavoriteBrand(e.target.value)}
              name="favoriteBrand"
              id="favoriteBrand"
              required
              disabled={disabled}
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
          <label htmlFor="equipment">Equipment:</label>
          <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              name="equipment"
              id="equipment"
              disabled={disabled}
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

          <button type="button" onClick={onCancel} disabled={disabled}>
            Cancel
          </button>
        </div>
      </form>
  );
};

export default EmployeeForm;

