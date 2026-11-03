import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import devGate from "./server/vite-dev-gate";

export default defineConfig({
  plugins: [react(), tailwindcss(), devGate()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
