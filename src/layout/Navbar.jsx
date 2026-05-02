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
        <Link to="/" style={linkStyle}>
          Groups
        </Link>

        <Link to="/approvals" style={linkStyle}>
          Approvals
        </Link>

        <Link to="/create-group" style={linkStyle}>
          Create
        </Link>
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  marginRight: "10px",
  textDecoration: "none",
};