import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Plus, Edit, Trash2, Calendar, Loader2 } from "lucide-react";

export default function ManageKegiatan() {
  const [items, setItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false); // State loading saat hapus

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase
      .from("kegiatan")
      .select("*")
      .order("date", { ascending: false });
    setItems(data || []);
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Yakin hapus kegiatan ini? Data dan foto akan hilang permanen.",
      )
    )
      return;

    setIsDeleting(true);

    try {
      // 1. Cari data yang mau dihapus untuk dapat URL gambarnya
      const itemToDelete = items.find((item) => item.id === id);

      if (itemToDelete && itemToDelete.image_url) {
        // 2. Ekstrak path file dari URL
        // URL contoh: .../storage/v1/object/public/kegiatan/OSIS/namafile.webp
        // Kita butuh path relatif di bucket: "OSIS/namafile.webp"

        const imageUrl = itemToDelete.image_url;
        // Ambil nama file paling belakang (setelah slash terakhir)
        const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        const filePath = `OSIS/${fileName}`; // Sesuaikan dengan folder 'OSIS' yang kita buat di upload

        // 3. Hapus file dari Storage
        const { error: storageError } = await supabase.storage
          .from("kegiatan")
          .remove([filePath]);

        if (storageError) {
          console.warn(
            "Gagal menghapus gambar dari storage (mungkin file sudah tidak ada):",
            storageError,
          );
          // Kita tetap lanjut hapus data di DB meskipun gambar gagal dihapus
        }
      }

      // 4. Hapus data dari Database
      const { error: dbError } = await supabase
        .from("kegiatan")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // Refresh data
      fetchData();
    } catch (error) {
      alert("Gagal menghapus: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Manajemen Kegiatan
          </h2>
          <p className="text-gray-500 text-sm">
            Kelola semua dokumentasi acara OSIS.
          </p>
        </div>
        <Link
          to="/admin/kegiatan/tambah"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-700 transition-all"
        >
          <Plus size={20} /> Tambah Kegiatan
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Kegiatan</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      alt={item.title}
                    />
                    <span className="font-semibold text-gray-700">
                      {item.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {/* Format tanggal biar cantik dikit */}
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/kegiatan/edit/${item.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty State jika tidak ada data */}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-gray-400 italic"
                >
                  Belum ada data kegiatan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
