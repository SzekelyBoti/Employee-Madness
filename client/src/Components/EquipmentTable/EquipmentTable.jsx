import { Link } from "react-router-dom";
import "./EquipmentTable.css";

const EquipmentTable = ({ equipments = [], onDelete }) => {
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
                  <Link to={`/equipments-update/${equipment._id}`}>
                    <button type="button">Update</button>
                  </Link>
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

