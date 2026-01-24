import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import AllMembers from "./pages/AllMembers";
import ProgramDetail from "./pages/Programdetail";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageMembers from "./pages/admin/ManageMembers";
import ManagePrograms from "./pages/admin/ManagePrograms";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<AllMembers />} />
        <Route path="/program/:id" element={<ProgramDetail />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN (PROTECTED) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Redirect /admin ke /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="members" element={<ManageMembers />} />
            <Route path="programs" element={<ManagePrograms />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
