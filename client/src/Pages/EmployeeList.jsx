import { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const PAGE_SIZE = 10;
const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [positionFilter, setPositionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [originalPresentState, setOriginalPresentState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [workingGroups, setWorkingGroups] = useState([]);

  // ---------- API Calls ----------
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
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [employeesData, groupsData] = await Promise.all([
        fetchEmployees(),
        fetchWorkingGroups(),
      ]);

      setEmployees(employeesData);
      setWorkingGroups(groupsData);

      // Store original present states
      const initialPresentState = {};
      employeesData.forEach((emp) => {
        initialPresentState[emp._id] = emp.present;
      });
      setOriginalPresentState(initialPresentState);

      setTotalPages(Math.ceil(employeesData.length / PAGE_SIZE));
      setLoading(false);
    };

    loadData();
  }, []);

  // ---------- Event Handlers ----------
  const handleDelete = async (id) => {
    await deleteEmployee(id);
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));
  };

  const handlePresentChange = (id, present) => updateEmployee(id, { present }).then(() => {
    setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? { ...emp, present } : emp))
    );
  });

  const handleWorkingGroupChange = (id, workingGroup) =>
      updateEmployee(id, { workingGroup }).then(() => {
        setEmployees((prev) =>
            prev.map((emp) => (emp._id === id ? { ...emp, workingGroup } : emp))
        );
      });

  const handleCheckboxChange = (id, checked) => {
    if (!checked) handlePresentChange(id, originalPresentState[id]);
  };

  // ---------- Search & Pagination ----------
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

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy] ?? "";
    const bValue = b[sortBy] ?? "";
    return sortOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
  });

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) return <Loading />;

  return (
      <div>
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

        <div className="sorting">
          <button onClick={() => setSortBy("name")}>Sort by Name</button>
          <button onClick={() => setSortBy("level")}>Sort by Level</button>
          <button onClick={() => setSortBy("position")}>Sort by Position</button>
        </div>

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

