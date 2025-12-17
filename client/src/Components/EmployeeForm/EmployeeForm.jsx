import { useState } from "react";

/**
 * @brief Form component for creating or updating employee records.
 *
 * This component provides a reusable form for both creating new employees
 * and updating existing employee records. It includes fields for employee
 * details and integrates with related data (equipment and favorite brands)
 * through dropdown selections. The form manages state internally and calls
 * the appropriate save handler when submitted.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSave - Callback function triggered when form is submitted.
 * @param {boolean} props.disabled - Whether the form controls should be disabled.
 * @param {Object} props.employee - Existing employee data for update mode.
 * @param {Function} props.onCancel - Callback function triggered when cancel button is clicked.
 * @param {Array} props.equipments - Array of available equipment for dropdown selection.
 * @param {Array} props.favoriteBrands - Array of available favorite brands for dropdown selection.
 *
 * @returns {JSX.Element} The rendered employee form component.
 */
const EmployeeForm = ({
                          onSave,
                          disabled,
                          employee,
                          onCancel,
                          equipments,
                          favoriteBrands,
                      }) => {
    // Form state management
    const [name, setName] = useState(employee?.name ?? "");
    const [level, setLevel] = useState(employee?.level ?? "");
    const [position, setPosition] = useState(employee?.position ?? "");
    const [selectedEquipment, setSelectedEquipment] = useState(
        employee?.equipment?.[0]?._id ?? ""
    );
    const [selectedFavoriteBrand, setFavoriteBrand] = useState(
        employee?.favoriteBrand?._id ?? ""
    );

    /**
     * @brief Handles form submission.
     *
     * @param {Event} e - The form submission event.
     *
     * Prevents default form submission, constructs employee data object,
     * and calls the onSave callback with appropriate data. For updates,
     * includes the employee ID; for creates, sends only the form data.
     */
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
            {/* Name input field */}
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

            {/* Level input field */}
            <div className="control">
                <label htmlFor="level">Level:</label>
                <input
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    name="level"
                    id="level"
                />
            </div>

            {/* Position input field */}
            <div className="control">
                <label htmlFor="position">Position:</label>
                <input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    name="position"
                    id="position"
                />
            </div>

            {/* Favorite brand dropdown selection */}
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

            {/* Equipment dropdown selection */}
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

            {/* Form action buttons */}
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

