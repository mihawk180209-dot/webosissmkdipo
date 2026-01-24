import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Cek perubahan sesi (misal logout di tab lain)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-10">Memuat...</div>;

  // Kalau tidak ada sesi (belum login), lempar ke login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Kalau ada sesi, render halaman anak (Dashboard, dll)
  return <Outlet />;
}
