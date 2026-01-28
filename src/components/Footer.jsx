import { Link } from "react-router-dom";
import {
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Heart,
  HeartPlus,
  HeartCrack,
} from "lucide-react";
import logoOsis from "../assets/300.png";
import logo from "../assets/logo yayasan al-hidayah-02.png";
import logoo from "../assets/logoosis.png";

// Komponen Ikon TikTok Custom
const TiktokIcon = ({ size = 20, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12v8.76c-.52 4.03-3.04 6.83-7.01 7.27-3.95.42-7.57-2.35-8.32-6.27-.67-3.75 1.57-7.66 5.37-8.33 1.57-.26 3.19.05 4.54.83v4.22c-.63-.35-1.35-.55-2.08-.56-1.78.02-3.32 1.43-3.48 3.21-.17 2.05 1.47 3.94 3.53 4.03 1.76.07 3.32-1.2 3.55-2.95.05-.53.04-1.06.02-1.59V.02h-.02z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* === GRID UTAMA (3 KOLOM) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* 1. BRANDING, LOGO & SOSMED */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo OSIS"
                className="w-12 h-12 object-contain bg-white rounded-full p-1"
              />
              <div>
                <h3 className="text-xl font-bold leading-none">
                  OSIS SMK DIPO 1
                </h3>
                <span className="text-xs text-gray-500 tracking-widest uppercase">
                  Jakarta Timur
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Wadah aspirasi dan kreativitas siswa untuk mewujudkan generasi
              yang Berkarakter, Berkarya, Berteknologi.
            </p>

            {/* SOSMED ICONS */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/osis_smkdipo1"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 group"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@osis_smkdipo1"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white hover:border hover:border-gray-600 transition-all duration-300 group"
              >
                <TiktokIcon size={18} />
              </a>
              <a
                href="https://www.youtube.com/@SMKDipo1"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 group"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* 2. NAVIGASI */}
          <div className="lg:pl-8">
            <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
              Jelajahi
            </h4>
            <ul className="space-y-3">
              {[
                "Beranda",
                "Tentang Kami",
                "Visi Misi",
                "Anggota OSIS",
                "Program Kerja",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-orange-500 hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. KONTAK KAMI */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
              Hubungi Kami
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <span>
                  Jl. Sunan Giri No.5, RT.8/RW.15,
                  <br />
                  Rawamangun, Kec. Pulo Gadung, Kota Jakarta Timur,
                  <br />
                  Daerah Khusus Ibukota Jakarta 13220
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={20} className="text-orange-500 shrink-0" />
                <span>osissmkdiposatu@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={20} className="text-orange-500 shrink-0" />
                <span>+62 21 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* === COPYRIGHT === */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} OSIS SMK Diponegoro 1 Jakarta. All
            rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>
              Built by
              <a
                href="https://instagram.com/_finssssss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-orange-500 hover:underline ml-1 transition-colors"
              >
                Finn
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
