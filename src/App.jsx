import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import Approvals from "./pages/Approvals";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./layout/Navbar";

import Groups from "./pages/Groups/Groups"; // ✅ NEW
import GroupDetails from "./pages/Groups/GroupDetails";
import Transactions from "./pages/Groups/Transactions";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={container}>
        <Routes>
          {/* ✅ Main entry = Groups page */}
          <Route path="/" element={<Groups />} />

          {/* ✅ Group Dashboard */}
          <Route path="/dashboard/:groupId" element={<Dashboard />} />

          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route
            path="/groups/:groupId/transactions"
            element={<Transactions />}
          />
        </Routes>

        {/* ✅ Bottom Navigation */}
        <div style={bottomNav}>
          <Link to="/">👥</Link>
          <Link to="/approvals">✅</Link>
          <Link to="/create-group">➕</Link>
        </div>
      </div>
    </BrowserRouter>
  );
}

/* Styles */

const container = {
  maxWidth: "420px",
  margin: "auto",
  minHeight: "100vh",
  paddingBottom: "60px",
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
  padding: "12px",
  borderTop: "1px solid #ddd",
};

export default App;