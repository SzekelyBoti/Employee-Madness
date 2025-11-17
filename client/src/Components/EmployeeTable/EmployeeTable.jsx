import { Link } from "react-router-dom";
import "./EmployeeTable.css";

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
  const handleWorkGroupChange = (employeeId, workingGroup) => {
    onWorkingGroupChange(employeeId, workingGroup);
  };

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
              <tr>
                <td colSpan="6">No employees found.</td>
              </tr>
          ) : (
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

        {/* Pagination */}
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

