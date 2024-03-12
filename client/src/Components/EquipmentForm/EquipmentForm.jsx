import { useState } from "react";

const EquipmentForm = ({ onSave, disabled, equipment, onCancel }) => {
  const [name, setName] = useState(equipment?.name ?? "");
  const [type, setType] = useState(equipment?.type ?? "");
  const [amount, setAmount] = useState(equipment?.amount ?? "");

  const onSubmit = (e) => {
    e.preventDefault();

    if (equipment) {
      return onSave({
        ...equipment,
        name,
        type,
        amount,
      });
    }

    return onSave({
      name,
      type,
      amount,
    });
  };

  return (
    <form className="EquipmentForm" onSubmit={onSubmit}>
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
        <label htmlFor="type">type:</label>
        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          name="type"
          id="type"
        />
      </div>

      <div className="control">
        <label htmlFor="amount">amount:</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          name="amount"
          id="amount"
        />
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {equipment ? "Update Equipment" : "Create Equipment"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;
