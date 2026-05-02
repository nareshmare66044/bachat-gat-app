import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import Approvals from "./pages/Approvals";
import Navbar from "./layout/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GroupDetails from "./pages/Groups/GroupDetails";
import Transactions from "./pages/Groups/Transactions";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/groups/:groupId/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;