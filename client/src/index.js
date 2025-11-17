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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <EmployeeList /> },
      { path: "/create", element: <EmployeeCreator /> },
      { path: "/update/:id", element: <EmployeeUpdater /> },
      { path: "/missing", element: <MissingEmployees /> },
      { path: "/table-test", element: <TableTest /> },
      { path: "/form-test", element: <FormTest /> },
      { path: "/equipments", element: <EquipmentList /> },
      { path: "/equipments-create", element: <EquipmentCreator /> },
      { path: "/equipments-update/:id", element: <EquipmentUpdater /> },
      { path: "/create-workinggroup", element: <CreateWorkingGroup /> },
      { path: "/working-groups", element: <WorkingGroupsList /> },
      { path: "/working-group-info/:id", element: <WorkingGroupInfo /> }, // lowercase to match refactored fetch URL
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);

reportWebVitals();

