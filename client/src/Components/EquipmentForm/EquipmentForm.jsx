import { useState } from "react";

/**
 * @brief Form component for creating or updating equipment records.
 *
 * This component provides a reusable form for both creating new equipment
 * and updating existing equipment records. It manages form state internally
 * and calls the appropriate save handler when submitted. The form includes
 * validation for required fields and proper input types.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSave - Callback function triggered when form is submitted.
 * @param {boolean} props.disabled - Whether the form controls should be disabled.
 * @param {Object} props.equipment - Existing equipment data for update mode.
 * @param {Function} props.onCancel - Callback function triggered when cancel button is clicked.
 *
 * @returns {JSX.Element} The rendered equipment form component.
 */
const EquipmentForm = ({ onSave, disabled = false, equipment = {}, onCancel }) => {
    // Form state management
    const [name, setName] = useState(equipment.name ?? "");
    const [type, setType] = useState(equipment.type ?? "");
    const [amount, setAmount] = useState(equipment.amount ?? "");

    /**
     * @brief Handles form submission.
     *
     * @param {Event} e - The form submission event.
     *
     * Prevents default form submission, constructs equipment data object,
     * and calls the onSave callback with appropriate data. For updates,
     * includes the equipment ID; for creates, sends only the form data.
     */
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
            {/* Name input field */}
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

            {/* Type input field */}
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

            {/* Amount input field (numeric) */}
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

            {/* Form action buttons */}
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
