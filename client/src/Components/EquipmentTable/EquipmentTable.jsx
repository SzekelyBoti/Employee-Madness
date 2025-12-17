import { Link } from "react-router-dom";
import "./EquipmentTable.css";

/**
 * @brief Component for displaying equipment data in a table format.
 *
 * This component renders a responsive table that displays equipment records
 * with their name, type, and amount. It provides action buttons for updating
 * or deleting each equipment record. The component handles empty states
 * gracefully and applies consistent styling through CSS.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.equipments - Array of equipment objects to display.
 * @param {Function} props.onDelete - Callback function triggered when delete button is clicked.
 *
 * @returns {JSX.Element} The rendered equipment table component.
 */
const EquipmentTable = ({ equipments = [], onDelete }) => {
    // Handle empty equipment list
    if (!equipments.length) {
        return (
            <div className="EquipmentTable">
                <p>No equipment found.</p>
            </div>
        );
    }

    return (
        <div className="EquipmentTable">
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {equipments.map((equipment) => (
                    <tr key={equipment._id}>
                        <td>{equipment.name}</td>
                        <td>{equipment.type}</td>
                        <td>{equipment.amount}</td>
                        <td>
                            {/* Update button with link to equipment update page */}
                            <Link to={`/equipments-update/${equipment._id}`}>
                                <button type="button">Update</button>
                            </Link>
                            {/* Delete button with callback */}
                            <button
                                type="button"
                                onClick={() => onDelete(equipment._id)}
                                style={{ marginLeft: "0.5rem" }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentTable;

