import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Users, FileText, ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const [stats, setStats] = useState({ members: 0, programs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: memberCount } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });
      const { count: programCount } = await supabase
        .from("programs")
        .select("*", { count: "exact", head: true });
      setStats({ members: memberCount || 0, programs: programCount || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div className="pb-20 md:pb-0">
      {" "}
      {/* Padding bottom for mobile nav if needed */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Selamat datang kembali, Admin! Berikut ringkasan data website.
        </p>
      </div>
      {/* STATS GRID: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Card Statistik Anggota */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 md:p-6 text-white shadow-lg shadow-orange-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 font-medium mb-1 text-sm md:text-base">
                Total Anggota
              </p>
              <h3 className="text-3xl md:text-4xl font-bold">
                {stats.members}
              </h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Card Statistik Program */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1 text-sm md:text-base">
                Program Kerja
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
                {stats.programs}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
          </div>
        </div>

        {/* Card Status */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1 text-sm md:text-base">
                Status Server
              </p>
              <h3 className="text-lg md:text-xl font-bold text-green-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
        </div>
      </div>
      <h3 className="font-bold text-gray-800 text-lg md:text-xl mb-4">
        Aksi Cepat
      </h3>
      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/members"
          className="group flex items-center justify-between p-4 md:p-5 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm md:text-base">
                Kelola Anggota
              </h4>
              <p className="text-xs md:text-sm text-gray-500">
                Tambah atau edit pengurus
              </p>
            </div>
          </div>
          <ArrowRight
            size={20}
            className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
          />
        </Link>

        <Link
          to="/admin/programs"
          className="group flex items-center justify-between p-4 md:p-5 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm md:text-base">
                Kelola Program
              </h4>
              <p className="text-xs md:text-sm text-gray-500">
                Update kegiatan terbaru
              </p>
            </div>
          </div>
          <ArrowRight
            size={20}
            className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
          />
        </Link>
      </div>
    </div>
  );
}
