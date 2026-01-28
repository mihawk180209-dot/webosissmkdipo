import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";

// --- LAZY LOAD PAGES ---
// Public Pages
const Home = lazy(() => import("./pages/Home"));
const AllMembers = lazy(() => import("./pages/AllMembers"));
const ProgramDetail = lazy(() => import("./pages/Programdetail"));
const Login = lazy(() => import("./pages/Login"));
const AllKegiatan = lazy(() => import("./pages/AllKegiatan"));

// Import Halaman Kegiatan (Page List & Detail)
const KegiatanPage = lazy(() => import("./components/Kegiatan")); // Halaman List
const DetailKegiatan = lazy(() => import("./pages/DetailKegiatan")); // Halaman Detail

// Admin Pages & Layouts
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const DashboardHome = lazy(() => import("./pages/admin/DashboardHome"));
const ManageMembers = lazy(() => import("./pages/admin/ManageMembers"));
const ManagePrograms = lazy(() => import("./pages/admin/ManagePrograms"));
const ManageVisiMisi = lazy(() => import("./pages/admin/ManageVisiMisi"));
const ManageKegiatan = lazy(() => import("./pages/admin/ManageKegiatan"));
const FormKegiatan = lazy(() => import("./pages/admin/FormKegiatan"));

// Komponen Loading
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<AllMembers />} />
          <Route path="/program/:id" element={<ProgramDetail />} />
          <Route path="/login" element={<Login />} />

          {/* KEGIATAN ROUTES */}
          <Route path="/kegiatan" element={<AllKegiatan />} />
          <Route path="/kegiatan" element={<KegiatanPage />} />
          <Route path="/kegiatan/:id" element={<DetailKegiatan />} />

          {/* ADMIN (PROTECTED) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="members" element={<ManageMembers />} />
              <Route path="programs" element={<ManagePrograms />} />
              <Route path="visi-misi" element={<ManageVisiMisi />} />

              {/* Admin Kegiatan */}
              <Route path="kegiatan" element={<ManageKegiatan />} />
              <Route path="kegiatan/tambah" element={<FormKegiatan />} />
              <Route path="kegiatan/edit/:id" element={<FormKegiatan />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
