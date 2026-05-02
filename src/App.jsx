import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import Approvals from "./pages/Approvals";
import Navbar from "./layout/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GroupDetails from "./pages/Groups/GroupDetails";
import Transactions from "./pages/Groups/Transactions";
import { Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={container}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/groups/:groupId/transactions" element={<Transactions />} />
      </Routes>
      <div style={bottomNav}>
        <Link to="/">🏠</Link>
        <Link to="/groups">👥</Link>
        <Link to="/approvals">✅</Link>
      </div>
    </div>
    </BrowserRouter>
  );
}

const container = {
  maxWidth: "420px",
  margin: "auto",
  minHeight: "100vh",
  paddingBottom: "60px", // space for bottom nav
  background: "#f5f7fb",
};

const bottomNav = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  maxWidth: "420px",
  display: "flex",
  justifyContent: "space-around",
  background: "#fff",
  padding: "10px",
  borderTop: "1px solid #ddd",
};

export default App;