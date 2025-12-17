import { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

/**
 * @brief Number of employees to display per page in the paginated view.
 *
 * @constant PAGE_SIZE
 * @type {number}
 *
 * Controls the pagination size for the employee list. Changing this value
 * affects how many employees are shown on each page before pagination occurs.
 */
const PAGE_SIZE = 10;

/**
 * @brief Base URL for API requests, configurable via environment variable.
 *
 * @constant API_BASE_URL
 * @type {string}
 *
 * Uses the REACT_APP_API_URL environment variable if set, otherwise defaults
 * to an empty string (relative URLs). This allows deployment flexibility
 * across different environments.
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/**
 * @brief Main component for displaying and managing the employee list.
 *
 * This component provides a comprehensive employee management interface with:
 * - Paginated employee listing
 * - Search and filtering capabilities
 * - Sorting by various fields
 * - Inline editing of employee properties
 * - Employee deletion
 * - Integration with working groups
 *
 * It handles data fetching, state management, and user interactions for
 * a complete employee management experience.
 *
 * @returns {JSX.Element} The rendered employee list management component.
 */
const EmployeeList = () => {
  // State for data management
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [originalPresentState, setOriginalPresentState] = useState({});
  const [workingGroups, setWorkingGroups] = useState([]);

  // State for filtering and sorting
  const [positionFilter, setPositionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------- API Calls ----------

  /**
   * @brief Fetches all employees from the backend API.
   *
   * @returns {Promise<Array>} A promise that resolves to an array of employee objects.
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  /**
   * @brief Fetches all working groups from the backend API.
   *
   * @returns {Promise<Array>} A promise that resolves to an array of working group objects.
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const fetchWorkingGroups = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/workingGroups`);
      if (!res.ok) throw new Error("Failed to fetch working groups");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  /**
   * @brief Deletes an employee from the backend.
   *
   * @param {string} id - The ID of the employee to delete.
   * @returns {Promise<Object>} A promise that resolves to the deletion response.
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");
      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @brief Updates an employee record in the backend.
   *
   * @param {string} id - The ID of the employee to update.
   * @param {Object} data - The data to update on the employee record.
   * @returns {Promise<Object>} A promise that resolves to the updated employee data.
   * @throws {Error} If the API request fails or returns a non-OK response.
   */
  const updateEmployee = async (id, data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update employee");
      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- Load Data ----------

  /**
   * @brief Loads initial data from the backend when the component mounts.
   *
   * Fetches employees and working groups in parallel for optimal performance.
   * Stores the original "present" state of each employee to enable checkbox
   * reset functionality. Calculates initial pagination settings.
   *
   * @effect
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Fetch both datasets in parallel
      const [employeesData, groupsData] = await Promise.all([
        fetchEmployees(),
        fetchWorkingGroups(),
      ]);

      setEmployees(employeesData);
      setWorkingGroups(groupsData);

      // Store original present states for checkbox reset functionality
      const initialPresentState = {};
      employeesData.forEach((emp) => {
        initialPresentState[emp._id] = emp.present;
      });
      setOriginalPresentState(initialPresentState);

      // Calculate pagination
      setTotalPages(Math.ceil(employeesData.length / PAGE_SIZE));
      setLoading(false);
    };

    loadData();
  }, []);

  // ---------- Event Handlers ----------

  /**
   * @brief Handles deletion of an employee.
   *
   * @param {string} id - The ID of the employee to delete.
   *
   * Deletes the employee from the backend and updates the local state
   * to remove the deleted employee from the list.
   */
  const handleDelete = async (id) => {
    await deleteEmployee(id);
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));
  };

  /**
   * @brief Updates the "present" status of an employee.
   *
   * @param {string} id - The ID of the employee to update.
   * @param {boolean} present - The new present status value.
   *
   * Sends the update to the backend and updates the local state
   * to reflect the change.
   */
  const handlePresentChange = (id, present) => updateEmployee(id, { present }).then(() => {
    setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? { ...emp, present } : emp))
    );
  });

  /**
   * @brief Updates the working group assignment of an employee.
   *
   * @param {string} id - The ID of the employee to update.
   * @param {string} workingGroup - The new working group assignment.
   *
   * Sends the update to the backend and updates the local state
   * to reflect the change.
   */
  const handleWorkingGroupChange = (id, workingGroup) =>
      updateEmployee(id, { workingGroup }).then(() => {
        setEmployees((prev) =>
            prev.map((emp) => (emp._id === id ? { ...emp, workingGroup } : emp))
        );
      });

  /**
   * @brief Handles checkbox changes for employee selection.
   *
   * @param {string} id - The ID of the employee whose checkbox changed.
   * @param {boolean} checked - The new checked state of the checkbox.
   *
   * When a checkbox is unchecked, resets the employee's "present" status
   * to its original value. This provides a "reset" functionality for
   * temporary selections.
   */
  const handleCheckboxChange = (id, checked) => {
    if (!checked) handlePresentChange(id, originalPresentState[id]);
  };

  // ---------- Search & Pagination ----------

  /**
   * @brief Filters employees based on current filter criteria.
   *
   * Applies all active filters (position, level, and search term)
   * to the employee list and returns only matching employees.
   *
   * @type {Array}
   */
  const filteredEmployees = employees.filter((emp) => {
    const positionMatch = positionFilter
        ? emp.position.toLowerCase().includes(positionFilter.toLowerCase())
        : true;
    const levelMatch = levelFilter ? emp.level === parseInt(levelFilter) : true;
    const searchMatch = searchTerm
        ? emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    return positionMatch && levelMatch && searchMatch;
  });

  /**
   * @brief Sorts filtered employees based on current sort criteria.
   *
   * Sorts the filtered employee list by the currently selected field
   * in the specified order (ascending or descending).
   *
   * @type {Array}
   */
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy] ?? "";
    const bValue = b[sortBy] ?? "";
    return sortOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
  });

  /**
   * @brief Extracts the current page of employees for display.
   *
   * Applies pagination to the sorted employee list based on the current
   * page and PAGE_SIZE constant.
   *
   * @type {Array}
   */
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + PAGE_SIZE);

  // Display loading state while data is being fetched
  if (loading) return <Loading />;

  return (
      <div>
        {/* Search and filter controls */}
        <div className="filters">
          <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
              type="text"
              placeholder="Search by level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
          />
          <input
              type="text"
              placeholder="Search by position"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
          />
        </div>

        {/* Sorting controls */}
        <div className="sorting">
          <button onClick={() => setSortBy("name")}>Sort by Name</button>
          <button onClick={() => setSortBy("level")}>Sort by Level</button>
          <button onClick={() => setSortBy("position")}>Sort by Position</button>
        </div>

        {/* Main employee table with all data and handlers */}
        <EmployeeTable
            employees={paginatedEmployees}
            workingGroups={workingGroups}
            onWorkingGroupChange={handleWorkingGroupChange}
            onPresentChange={handlePresentChange}
            onCheckboxChange={handleCheckboxChange}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredEmployees.length / PAGE_SIZE)}
            onPageChange={setCurrentPage}
        />
      </div>
  );
};

export default EmployeeList;

