import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};
const fetchSearchEmployees = (searchTerm) => {
  return fetch(`/api/employees/${searchTerm}`).then((res) => res.json());
};

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [positionFilter, setPositionFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    deleteEmployee(id);
    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    fetchEmployees().then((employees) => {
      setLoading(false);
      setEmployees(employees);
    });
  }, []);
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchSearchEmployees(searchTerm)
        .then((employees) => {
          setLoading(false);
          setEmployees(employees);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  }, [searchTerm]);

  if (loading) {
    return <Loading />;
  }

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const positionMatch = positionFilter
      ? employee.position
          .toLowerCase()
          .includes(positionFilter.toLocaleLowerCase())
      : true;
    const levelMatch = levelFilter
      ? employee.level.toLowerCase().includes(levelFilter.toLocaleLowerCase())
      : true;

    return positionMatch && levelMatch;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let comparison = 0;

    if (
      sortBy === "firstName" ||
      sortBy === "lastName" ||
      sortBy === "middleName"
    ) {
      const aNameParts = a.name.split(" ");
      const bNameParts = b.name.split(" ");
      let aFirstName = "";
      let aMiddleName = "";
      let aLastName = "";
      let bFirstName = "";
      let bMiddleName = "";
      let bLastName = "";

      if (aNameParts.length === 1) {
        aFirstName = aNameParts[0];
      } else if (aNameParts.length === 2) {
        aFirstName = aNameParts[0];
        aLastName = aNameParts[1];
      } else {
        aFirstName = aNameParts[0];
        aLastName = aNameParts.pop();
        aMiddleName = aNameParts.slice(1).join(" ");
      }

      if (bNameParts.length === 1) {
        bFirstName = bNameParts[0];
      } else if (bNameParts.length === 2) {
        bFirstName = bNameParts[0];
        bLastName = bNameParts[1];
      } else {
        bFirstName = bNameParts[0];
        bLastName = bNameParts.pop();
        bMiddleName = bNameParts.slice(1).join(" ");
      }

      if (sortBy === "firstName") {
        comparison = aFirstName.localeCompare(bFirstName);
      } else if (sortBy === "middleName") {
        if (aMiddleName && bMiddleName) {
          comparison = aMiddleName.localeCompare(bMiddleName);
        } else if (!aMiddleName && bMiddleName) {
          comparison = -1;
        } else if (aMiddleName && !bMiddleName) {
          comparison = 1;
        } else {
          comparison = aFirstName.localeCompare(bFirstName);
        }
      } else if (sortBy === "lastName") {
        if (aLastName && bLastName) {
          comparison = aLastName.localeCompare(bLastName);
        } else if (!aLastName && bLastName) {
          comparison = -1;
        } else if (aLastName && !bLastName) {
          comparison = 1;
        }
      }
    } else {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      comparison = aValue.localeCompare(bValue);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filters">
        <input
          className="searchLevel"
          type="text"
          placeholder="Search by level"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        />
        <input
          className="searchPosition"
          type="text"
          placeholder="Search by position"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        />
      </div>
      <div className="sorting">
        <button onClick={() => handleSort("firstName")}>
          Sort by First name{" "}
          {sortBy === "firstName" && (sortOrder === "asc" ? "▲" : "▼")}
        </button>
        <button onClick={() => handleSort("middleName")}>
          Sort by middle name{" "}
          {sortBy === "middleName" && (sortOrder === "asc" ? "▲" : "▼")}
        </button>
        <button onClick={() => handleSort("lastName")}>
          Sort by last name{" "}
          {sortBy === "lastName" && (sortOrder === "asc" ? "▲" : "▼")}
        </button>
        <button onClick={() => handleSort("level")}>
          Sort by Level{" "}
          {sortBy === "level" && (sortOrder === "asc" ? "▲" : "▼")}
        </button>
        <button onClick={() => handleSort("position")}>
          Sort by Position{" "}
          {sortBy === "position" && (sortOrder === "asc" ? "▲" : "▼")}
        </button>
      </div>
      <EmployeeTable employees={sortedEmployees} onDelete={handleDelete} />
    </div>
  );
};

export default EmployeeList;
