import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Lock, User, Loader2 } from "lucide-react"; // Ganti Mail jadi User

export default function Login() {
  // Ubah state 'email' jadi 'username' biar kodingan lebih masuk akal
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- TRIK DOMAIN PALSU ---
      // Gabungkan username inputan dengan domain palsu
      const fakeEmail = `${username}@osis.dipo`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail, // Kirim email palsu ke Supabase
        password,
      });

      if (error) throw error;

      navigate("/admin/dashboard");
    } catch (error) {
      alert("Login Gagal: Username atau Password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 mt-2">
            Masuk untuk mengelola website OSIS
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              {/* Pakai Ikon User */}
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text" // Tipe text, bukan email
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())} // Trim spasi
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Masuk Dashboard"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-orange-500">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
