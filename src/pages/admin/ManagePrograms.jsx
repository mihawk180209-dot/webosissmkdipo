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

export default function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    imageUrl: null,
    title: "",
  });
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    content: "",
    image_url: "",
  });
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });
    setPrograms(data || []);
  };

  // --- HELPER: CONVERT KE WEBP ---
  const convertImageToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Convert ke WebP, Quality 0.8
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                },
              );
              resolve(newFile);
            } else {
              reject(new Error("Gagal konversi gambar"));
            }
          },
          "image/webp",
          0.8,
        );
      };
      img.onerror = (error) => reject(error);
      img.src = URL.createObjectURL(file);
    });
  };

  // --- LOGIC HAPUS FILE ---
  const deleteFileFromStorage = async (imageUrl) => {
    if (!imageUrl) return;
    // Cek path bucket
    if (imageUrl.includes("/osis-gallery/")) {
      const filePath = imageUrl.split("/osis-gallery/")[1];
      if (filePath)
        await supabase.storage.from("osis-gallery").remove([filePath]);
    }
  };

  const confirmDelete = (prog) => {
    setDeleteModal({
      show: true,
      id: prog.id,
      imageUrl: prog.image_url,
      title: prog.title,
    });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    await deleteFileFromStorage(deleteModal.imageUrl); // Hapus gambar dulu
    await supabase.from("programs").delete().eq("id", deleteModal.id);
    fetchPrograms();
    setDeleteModal({ show: false, id: null, imageUrl: null, title: "" });
  };

  // --- UPLOAD DENGAN AUTO CONVERT WEBP ---
  const handleUpload = async () => {
    if (!file) return null;

    try {
      setUploading(true);

      // 1. Convert ke WebP
      const webpFile = await convertImageToWebP(file);

      // 2. Set nama file .webp
      const fileName = `programs/${Date.now()}.webp`;

      // 3. Upload
      const { error } = await supabase.storage
        .from("osis-gallery")
        .upload(fileName, webpFile, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("osis-gallery")
        .getPublicUrl(fileName);

      setUploading(false);
      return data.publicUrl;
    } catch (error) {
      alert("Upload error: " + error.message);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = form.image_url;

    // Jika ganti foto
    if (file) {
      if (isEditing && form.image_url) {
        await deleteFileFromStorage(form.image_url); // Hapus yang lama
      }
      const newUrl = await handleUpload();
      if (newUrl) finalImageUrl = newUrl;
    }

    const payload = { ...form, image_url: finalImageUrl };
    delete payload.id;

    if (isEditing)
      await supabase.from("programs").update(payload).eq("id", form.id);
    else await supabase.from("programs").insert(payload);

    fetchPrograms();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      content: "",
      image_url: "",
    });
    setFile(null);
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Program Kerja</h1>
          <p className="text-gray-500 text-sm">
            Kelola artikel dan kegiatan OSIS
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-orange-700 shadow-md"
        >
          <Plus size={18} /> Buat Program
        </button>
      </div>

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
                  {isEditing ? "Edit Program" : "Tulis Program Baru"}
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
                      Judul Program
                    </label>
                    <input
                      placeholder="Contoh: Class Meeting 2026"
                      className="border border-gray-300 p-3.5 rounded-xl w-full font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Singkat
                    </label>
                    <input
                      placeholder="Untuk tampilan di kartu depan..."
                      className="border border-gray-300 p-3.5 rounded-xl w-full focus:ring-2 focus:ring-orange-500 outline-none"
                      required
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Isi Lengkap (Artikel)
                  </label>
                  <textarea
                    placeholder="Tulis detail kegiatan di sini..."
                    rows="8"
                    className="border border-gray-300 p-4 rounded-xl w-full focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner / Logo Program (Auto WebP)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-50 relative group transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center">
                      <Upload
                        size={32}
                        className="text-gray-400 group-hover:text-orange-500 mb-2 transition-colors"
                      />
                      <span className="text-gray-600 font-medium">
                        {file ? file.name : "Klik untuk upload banner"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Format JPG/PNG akan otomatis dikonversi ke WebP
                      </span>
                    </div>
                  </div>
                  {isEditing && form.image_url && !file && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Foto lama tersimpan.
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={uploading}
                    className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-orange-200 transition-transform active:scale-95"
                  >
                    {uploading && (
                      <Loader2 size={20} className="animate-spin" />
                    )}
                    {uploading ? "Mengupload & Convert..." : "Simpan Program"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full"
          >
            <div className="h-48 relative bg-gray-100">
              <img
                src={prog.image_url}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt=""
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => {
                    setForm(prog);
                    setIsEditing(true);
                    setShowForm(true);
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white/90 p-2 rounded-lg shadow text-blue-600 hover:text-blue-700 hover:bg-white"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => confirmDelete(prog)}
                  className="bg-white/90 p-2 rounded-lg shadow text-red-600 hover:text-red-700 hover:bg-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h4 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                {prog.title}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow leading-relaxed">
                {prog.description}
              </p>
              <div className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-auto">
                Diposting:{" "}
                {new Date(prog.created_at).toLocaleDateString("id-ID")}
              </div>
            </div>
          </div>
        ))}
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
                  Hapus Program?
                </h3>
                <p className="text-gray-500 mb-6">
                  Yakin ingin menghapus <b>"{deleteModal.title}"</b>? Banner
                  juga akan dihapus.
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
                    Hapus
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
