import { useState } from "react";

const EquipmentForm = ({ onSave, disabled = false, equipment = {}, onCancel }) => {
  const [name, setName] = useState(equipment.name ?? "");
  const [type, setType] = useState(equipment.type ?? "");
  const [amount, setAmount] = useState(equipment.amount ?? "");

  const onSubmit = (e) => {
    e.preventDefault();

    const equipmentData = { name, type, amount };

    // If updating an existing equipment
    if (equipment._id) {
      onSave({ ...equipment, ...equipmentData });
    } else {
      onSave(equipmentData);
    }
  };

  return (
      <form className="EquipmentForm" onSubmit={onSubmit}>
        <div className="control">
          <label htmlFor="name">Name:</label>
          <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
          />
        </div>

        <div className="control">
          <label htmlFor="type">Type:</label>
          <input
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
          />
        </div>

        <div className="control">
          <label htmlFor="amount">Amount:</label>
          <input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              required
          />
        </div>

        <div className="buttons">
          <button type="submit" disabled={disabled}>
            {equipment._id ? "Update Equipment" : "Create Equipment"}
          </button>

          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
  );
};

export default EquipmentForm;
