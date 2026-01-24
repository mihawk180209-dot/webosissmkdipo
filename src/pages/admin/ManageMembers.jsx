import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Trash2,
  Edit,
  Plus,
  Upload,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    imageUrl: null,
    name: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    position: "",
    image_url: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("id");
    setMembers(data || []);
    setLoading(false);
  };

  // --- LOGIC HAPUS FILE (Dipakai saat Hapus Data & Ganti Foto) ---
  const deleteFileFromStorage = async (imageUrl) => {
    if (!imageUrl) return;
    const filePath = imageUrl.split("/osis-gallery/")[1];
    if (filePath)
      await supabase.storage.from("osis-gallery").remove([filePath]);
  };

  const confirmDelete = (member) =>
    setDeleteModal({
      show: true,
      id: member.id,
      imageUrl: member.image_url,
      name: member.name,
    });

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    // 1. Hapus File dulu
    await deleteFileFromStorage(deleteModal.imageUrl);
    // 2. Hapus Data
    await supabase.from("members").delete().eq("id", deleteModal.id);

    fetchMembers();
    setDeleteModal({ show: false, id: null, imageUrl: null, name: "" });
  };

  const handleUpload = async () => {
    if (!file) return null; // Return null jika tidak ada file baru
    const fileExt = file.name.split(".").pop();
    const fileName = `members/${Date.now()}.${fileExt}`;
    setUploading(true);
    const { error } = await supabase.storage
      .from("osis-gallery")
      .upload(fileName, file);
    if (error) {
      alert("Gagal upload: " + error.message);
      setUploading(false);
      return null;
    }
    const { data } = supabase.storage
      .from("osis-gallery")
      .getPublicUrl(fileName);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = form.image_url; // Default pakai URL lama

    // Jika ada file baru yang diupload
    if (file) {
      // 1. Hapus foto lama jika ada (Biar hemat storage)
      if (isEditing && form.image_url) {
        await deleteFileFromStorage(form.image_url);
      }
      // 2. Upload foto baru
      const newUrl = await handleUpload();
      if (newUrl) finalImageUrl = newUrl;
    }

    const payload = {
      name: form.name,
      position: form.position,
      image_url: finalImageUrl,
    };

    if (isEditing) {
      await supabase.from("members").update(payload).eq("id", form.id);
    } else {
      await supabase.from("members").insert(payload);
    }
    fetchMembers();
    resetForm();
  };

  const openEdit = (member) => {
    setForm(member);
    setFile(null);
    setIsEditing(true);
    setShowForm(true);
  };
  const resetForm = () => {
    setForm({ id: null, name: "", position: "", image_url: "" });
    setFile(null);
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="relative pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Anggota</h1>
          <p className="text-gray-500 text-sm">
            Total: {members.length} Anggota
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-orange-700 shadow-md"
        >
          <Plus size={18} /> Tambah Anggota
        </button>
      </div>

      {/* FORM INPUT (FULL WIDTH & MODERN) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-orange-100">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="font-bold text-xl text-gray-800">
                  {isEditing ? "Edit Data Anggota" : "Tambah Anggota Baru"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      placeholder="Contoh: Budi Santoso"
                      className="border border-gray-300 p-3.5 rounded-xl w-full focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jabatan
                    </label>
                    <input
                      placeholder="Contoh: Ketua OSIS"
                      className="border border-gray-300 p-3.5 rounded-xl w-full focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      required
                      value={form.position}
                      onChange={(e) =>
                        setForm({ ...form, position: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Upload Area */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Foto Profil
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors cursor-pointer relative group">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center">
                      <Upload
                        size={32}
                        className="text-gray-400 group-hover:text-orange-500 mb-2 transition-colors"
                      />
                      <p className="text-gray-600 font-medium">
                        {file ? file.name : "Klik untuk upload foto baru"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Format: JPG, PNG (Max 2MB)
                      </p>
                    </div>
                  </div>
                  {isEditing && form.image_url && !file && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      ✓ Menggunakan foto lama. Upload baru untuk mengganti.
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    disabled={uploading}
                    className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-200 transition-transform active:scale-95"
                  >
                    {uploading && (
                      <Loader2 size={20} className="animate-spin" />
                    )}
                    {uploading ? "Mengupload..." : "Simpan Data"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARD LIST (MOBILE) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={member.image_url}
                className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-200"
                alt=""
              />
              <div>
                <h4 className="font-bold text-gray-800">{member.name}</h4>
                <p className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full inline-block">
                  {member.position}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(member)}
                className="p-2 text-blue-600 bg-blue-50 rounded-lg"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => confirmDelete(member)}
                className="p-2 text-red-600 bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE (DESKTOP) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-5 text-sm font-semibold text-gray-600">
                Profil
              </th>
              <th className="p-5 text-sm font-semibold text-gray-600">
                Nama Lengkap
              </th>
              <th className="p-5 text-sm font-semibold text-gray-600">
                Jabatan
              </th>
              <th className="p-5 text-sm font-semibold text-gray-600 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-5">
                  <img
                    src={member.image_url}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200"
                    alt=""
                  />
                </td>
                <td className="p-5 font-medium text-gray-800">{member.name}</td>
                <td className="p-5">
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                    {member.position}
                  </span>
                </td>
                <td className="p-5 text-right space-x-2">
                  <button
                    onClick={() => openEdit(member)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(member)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DELETE */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="text-center">
                <div className="mx-auto w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  Hapus Anggota?
                </h3>
                <p className="text-gray-500 mb-6">
                  Data <b>{deleteModal.name}</b> akan dihapus permanen beserta
                  fotonya.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setDeleteModal({ ...deleteModal, show: false })
                    }
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={executeDelete}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
