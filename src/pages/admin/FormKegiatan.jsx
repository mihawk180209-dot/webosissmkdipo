import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import {
  Save,
  ChevronLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function FormKegiatan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    content: "",
    image_url: "",
    category: "Event",
  });

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  async function fetchDetail() {
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setForm(data);
      setPreview(data.image_url);
    }
  }

  // --- FUNGSI BARU: Konversi ke WebP ---
  const convertFileToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // Convert ke Blob WebP dengan kualitas 80% (0.8)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Gagal mengonversi gambar."));
              }
            },
            "image/webp",
            0.8,
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Fungsi handle pilih file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Fungsi upload ke Supabase Storage (MODIFIED)
  async function uploadImage(originalFile) {
    // 1. Lakukan konversi file asli ke WebP
    const webpBlob = await convertFileToWebP(originalFile);

    // 2. Buat nama file baru dengan akhiran .webp
    const fileName = `${Math.random()}.webp`;
    const filePath = `OSIS/${fileName}`;

    // 3. Upload Blob WebP ke Supabase
    const { error: uploadError } = await supabase.storage
      .from("kegiatan")
      .upload(filePath, webpBlob, {
        contentType: "image/webp", // Pastikan content type benar
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Ambil Public URL
    const { data } = supabase.storage.from("kegiatan").getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = form.image_url;

      // Jika ada file baru dipilih, upload dulu
      if (file) {
        setUploading(true);
        // uploadImage sekarang otomatis convert ke webp
        finalImageUrl = await uploadImage(file);
        setUploading(false);
      }

      const payload = { ...form, image_url: finalImageUrl };

      if (id) {
        const { error } = await supabase
          .from("kegiatan")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("kegiatan").insert([payload]);
        if (error) throw error;
      }

      navigate("/admin/kegiatan");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 mb-6 hover:text-orange-600 transition-colors"
      >
        <ChevronLeft size={20} /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-8">
          {id ? "📝 Edit Kegiatan" : "Tambah Kegiatan Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* UPLOAD FOTO SECTION */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Foto Utama Kegiatan
            </label>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-64 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={40} strokeWidth={1.5} />
                    <span className="text-xs mt-2">Belum ada foto</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-600" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-xs text-gray-500">
                  Format: JPG, PNG. Otomatis dikonversi ke <strong>WebP</strong>{" "}
                  untuk performa maksimal.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold cursor-pointer hover:bg-orange-100 transition-colors text-sm">
                  <Upload size={18} />
                  Pilih File Foto
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Judul Kegiatan
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Lomba Futsal Antar Kelas"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tanggal Pelaksanaan
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Kategori
            </label>
            <div className="flex flex-wrap gap-3">
              {["Event", "Lomba", "Rapat", "Sosial"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    form.category === cat
                      ? "bg-orange-600 text-white shadow-md shadow-orange-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Deskripsi Singkat
            </label>
            <textarea
              rows="2"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Muncul di kartu halaman depan..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Konten Lengkap
            </label>
            <textarea
              required
              rows="8"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Ceritakan keseruan acaranya di sini..."
            ></textarea>
          </div>

          <button
            disabled={loading || uploading}
            type="submit"
            className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Memproses...
              </>
            ) : (
              <>
                <Save size={20} /> Simpan Kegiatan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
