import { Outlet, Link } from "react-router-dom";
import "./Layout.css";

const Layout = () => (
    <div className="Layout">
      <nav>
        <ul>
          <li className="grow">
            <Link to="/">Employees</Link>
          </li>
          <li>
            <Link to="/missing">
              <button type="button">Missing Employees</button>
            </Link>
          </li>
          <li>
            <Link to="/create">
              <button type="button">Create Employee</button>
            </Link>
          </li>
          <li>
            <Link to="/equipments-create">
              <button type="button">Create Equipment</button>
            </Link>
          </li>
          <li>
            <Link to="/equipments">
              <button type="button">Equipments</button>
            </Link>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
);

export default Layout;

