import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import obfuscator from "rollup-plugin-obfuscator"; // <--- Import ini

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // 2. TAMBAHKAN KONFIGURASI OBFUSCATOR DI SINI
    obfuscator({
      // Opsi agar obfuscator hanya jalan saat build (bukan saat coding/dev)
      // Supaya laptop tidak lemot saat coding
      apply: "build",

      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1,
      },
    }),
  ],
});
