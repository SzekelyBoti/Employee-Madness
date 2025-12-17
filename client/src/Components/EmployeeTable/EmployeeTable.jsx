import { Link } from "react-router-dom";
import "./EmployeeTable.css";

/**
 * @brief Component for displaying employee data in a table format with interactive features.
 *
 * This component renders a comprehensive employee management table with features including:
 * - Display of employee information (name, level, position)
 * - Interactive working group assignment with dropdown selection
 * - Present/absent status toggles
 * - Update and delete actions for each employee
 * - Pagination controls for navigating large datasets
 *
 * @param {Object} props - The component props.
 * @param {Array} props.employees - Array of employee objects to display.
 * @param {Function} props.onDelete - Callback triggered when delete button is clicked.
 * @param {Function} props.onPresentChange - Callback triggered when present checkbox changes.
 * @param {number} props.currentPage - Current page number for pagination.
 * @param {number} props.totalPages - Total number of pages for pagination.
 * @param {Function} props.onPageChange - Callback triggered when page navigation occurs.
 * @param {Function} props.onWorkingGroupChange - Callback triggered when working group assignment changes.
 * @param {Array} props.workingGroups - Array of available working groups for dropdown.
 *
 * @returns {JSX.Element} The rendered employee table component.
 */
const EmployeeTable = ({
                           employees = [],
                           onDelete,
                           onPresentChange,
                           currentPage = 1,
                           totalPages = 1,
                           onPageChange,
                           onWorkingGroupChange,
                           workingGroups = [],
                       }) => {
    /**
     * @brief Handles working group selection changes.
     *
     * @param {string} employeeId - The ID of the employee being updated.
     * @param {string} workingGroup - The new working group ID (empty string to clear).
     *
     * Forwards the working group change to the parent component's handler.
     */
    const handleWorkGroupChange = (employeeId, workingGroup) => {
        onWorkingGroupChange(employeeId, workingGroup);
    };

    /**
     * @brief Handles removal of an employee from a working group.
     *
     * @param {string} employeeId - The ID of the employee to remove from group.
     *
     * Calls the working group change handler with an empty string to clear
     * the working group assignment. Handles any errors that occur.
     */
    const handleRemoveFromGroup = async (employeeId) => {
        try {
            await onWorkingGroupChange(employeeId, "");
        } catch (error) {
            console.error("Error removing employee from work group:", error);
        }
    };

    return (
        <div className="EmployeeTable">
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Position</th>
                    <th>Working Group</th>
                    <th>Present</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {employees.length === 0 ? (
                    // Empty state row
                    <tr>
                        <td colSpan="6">No employees found.</td>
                    </tr>
                ) : (
                    // Employee data rows
                    employees.map((employee) => (
                        <tr key={employee._id}>
                            <td>{employee.name}</td>
                            <td>{employee.level}</td>
                            <td>{employee.position}</td>

                            {/* Working Group Dropdown */}
                            <td>
                                <select
                                    value={employee.workingGroup || ""}
                                    onChange={(e) =>
                                        handleWorkGroupChange(employee._id, e.target.value)
                                    }
                                >
                                    <option value="">Select Working Group</option>
                                    {workingGroups.map((group) => (
                                        <option key={group._id} value={group._id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Remove button (only shown when employee is in a group) */}
                                {employee.workingGroup && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFromGroup(employee._id)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </td>

                            {/* Present Checkbox */}
                            <td>
                                <input
                                    type="checkbox"
                                    checked={!!employee.present}
                                    onChange={(e) =>
                                        onPresentChange(employee._id, e.target.checked)
                                    }
                                />
                            </td>

                            {/* Actions */}
                            <td>
                                <Link to={`/update/${employee._id}`}>
                                    <button type="button">Update</button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => onDelete(employee._id)}
                                    style={{ marginLeft: "5px" }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EmployeeTable;

