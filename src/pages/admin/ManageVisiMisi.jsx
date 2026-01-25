import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Save, Loader2, AlertCircle } from "lucide-react";

export default function ManageVisiMisi() {
  const [form, setForm] = useState({ vision: "", mission: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Kita ambil data dengan ID = 1 karena cuma ada 1 baris
    const { data } = await supabase
      .from("school_profile")
      .select("*")
      .eq("id", 1)
      .single();
    if (data) setForm(data);
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Update data baris ke-1
    const { error } = await supabase
      .from("school_profile")
      .update({ vision: form.vision, mission: form.mission })
      .eq("id", 1);

    if (error) {
      alert("Gagal menyimpan!");
    } else {
      alert("Berhasil update Visi Misi!");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Visi & Misi</h1>
        <p className="text-gray-500 text-sm">
          Ubah visi misi sekolah yang tampil di halaman depan.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-orange-100">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* VISI */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Visi Sekolah
            </label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.vision}
              onChange={(e) => setForm({ ...form, vision: e.target.value })}
            />
          </div>

          {/* MISI */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Misi Sekolah
            </label>
            <div className="flex items-start gap-2 mb-2 bg-blue-50 p-3 rounded-lg text-blue-700 text-xs">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                Tips: Gunakan "Enter" untuk membuat poin baru (baris baru).
              </span>
            </div>
            <textarea
              rows="8"
              className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.mission}
              onChange={(e) => setForm({ ...form, mission: e.target.value })}
            />
          </div>

          <button
            disabled={saving}
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
