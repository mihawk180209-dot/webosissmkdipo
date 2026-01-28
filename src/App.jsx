import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react"; // Ikon loading
import ProtectedRoute from "./components/ProtectedRoute";

// --- LAZY LOAD PAGES (Code Splitting) ---
// Public Pages
const Home = lazy(() => import("./pages/Home"));
const AllMembers = lazy(() => import("./pages/AllMembers"));
const ProgramDetail = lazy(() => import("./pages/Programdetail"));
const Login = lazy(() => import("./pages/Login"));

// Admin Pages & Layouts
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const DashboardHome = lazy(() => import("./pages/admin/DashboardHome"));
const ManageMembers = lazy(() => import("./pages/admin/ManageMembers"));
const ManagePrograms = lazy(() => import("./pages/admin/ManagePrograms"));
const ManageVisiMisi = lazy(() => import("./pages/admin/ManageVisiMisi"));

// Komponen Loading Keren
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <Loader2 className="animate-spin text-orange-600 w-12 h-12 mb-4" />
    <p className="text-slate-500 font-medium animate-pulse">
      Memuat halaman...
    </p>
  </div>
);

function App() {
  return (
    <Router>
      {/* Bungkus Routes dengan Suspense */}
      <Suspense fallback={<PageLoader />}>
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
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="members" element={<ManageMembers />} />
              <Route path="programs" element={<ManagePrograms />} />
              <Route path="visi-misi" element={<ManageVisiMisi />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
