import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";
import EmployeeList from "./Pages/EmployeeList";
import EmployeeCreator from "./Pages/EmployeeCreator";
import EmployeeUpdater from "./Pages/EmployeeUpdater";
import EquipmentList from "./Pages/EquipmentList";
import EquipmentCreator from "./Pages/EquipmentCreator";
import EquipmentUpdater from "./Pages/EquipmentUpdater";
import MissingEmployees from "./Components/EmployeeMissing";
import CreateWorkingGroup from "./Pages/WorkingGroupCreator";
import WorkingGroupsList from "./Pages/WorkingGroupList";
import WorkingGroupInfo from "./Pages/WorkingGroupInfo";
import TableTest from "./Pages/TableTest";
import FormTest from "./Pages/FormTest";

import "./index.css";

/**
 * @brief Defines the application's routing configuration.
 *
 * @constant router
 * @type {BrowserRouter}
 *
 * This router configuration maps URL paths to React components, creating a single-page
 * application structure with nested routing. The Layout component serves as the root
 * container with ErrorPage for error handling and child routes for specific pages.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      // Employee management routes
      { path: "/", element: <EmployeeList /> },
      { path: "/create", element: <EmployeeCreator /> },
      { path: "/update/:id", element: <EmployeeUpdater /> },
      { path: "/missing", element: <MissingEmployees /> },

      // Testing routes (development)
      { path: "/table-test", element: <TableTest /> },
      { path: "/form-test", element: <FormTest /> },

      // Equipment management routes
      { path: "/equipments", element: <EquipmentList /> },
      { path: "/equipments-create", element: <EquipmentCreator /> },
      { path: "/equipments-update/:id", element: <EquipmentUpdater /> },

      // Working group management routes
      { path: "/create-workinggroup", element: <CreateWorkingGroup /> },
      { path: "/working-groups", element: <WorkingGroupsList /> },
      { path: "/working-group-info/:id", element: <WorkingGroupInfo /> }, // lowercase to match refactored fetch URL
    ],
  },
]);

/**
 * @brief Application entry point that renders the React application.
 *
 * This module initializes the React application by:
 * 1. Creating a root DOM element for React to render into
 * 2. Setting up client-side routing with React Router
 * 3. Wrapping the application in React.StrictMode for development checks
 * 4. Starting Web Vitals reporting for performance monitoring
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);

// Start reporting web vitals (performance metrics)
reportWebVitals();

