import { useState } from "react";
import { Link } from "react-router-dom";
import "./EmployeeTable.css";

const EmployeeTable = ({
  employees,
  onDelete,
  onPresentChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [nameSortOrder, setNameSortOrder] = useState("asc");

  const handleNameSort = () => {
    setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
  };

  const compareNames = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  };

  const sortedEmployees = employees.slice().sort((a, b) => {
    if (nameSortOrder === "asc") {
      return compareNames(a, b);
    } else {
      return compareNames(b, a);
    }
  });

  return (
    <div className="EmployeeTable">
      <table>
        <thead>
          <tr>
            <th onClick={handleNameSort}>
              Name {nameSortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th>Level</th>
            <th>Position</th>
            <th>Present</th>
            <th>Actions</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>
                <input
                  type="checkbox"
                  checked={employee.present}
                  onChange={(e) =>
                    onPresentChange(employee._id, e.target.checked)
                  }
                />
              </td>
              <td>
                <Link to={`/update/${employee._id}`}>
                  <button type="button">Update</button>
                </Link>
                <button type="button" onClick={() => onDelete(employee._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
