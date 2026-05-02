import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h2>Bachat Gat</h2>

      <div>
        <Link to="/" style={{ color: "white", marginRight: "10px" }}>
          Dashboard
        </Link>

        <Link to="/groups" style={{ color: "white", marginRight: "10px" }}>
          Groups
        </Link>

        <Link to="/approvals" style={{ color: "white" }}>
          Approvals
        </Link>
      </div>
    </div>
  );
}