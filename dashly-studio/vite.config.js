import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirrors the "@/*" path mapping in tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'safari13',
    rollupOptions: {
      output: {
        /**
         * Without this, Rollup's default heuristic lumps three.js core AND
         * the GLTFLoader/BufferGeometryUtils examples (only needed once, to
         * parse hello.glb) into the SAME chunk as whichever dynamic import
         * reaches them first — which happened to be `preloadHello`, so that
         * one chunk ballooned to ~608KB even though the fur-rendering logic
         * itself (shaders, strand/support materials) was already correctly
         * isolated in HelloModel's own chunk.
         *
         * Splitting three's core out into its own vendor chunk, separate
         * from the GLTFLoader/BufferGeometryUtils examples, means:
         *   - the three-core chunk is cacheable independently of app code
         *     that changes far more often;
         *   - the loader-only code (needed just for the initial glb parse)
         *     stops being welded to three's core, so browsers can fetch the
         *     pieces in parallel instead of one monolithic block.
         * Purely a bundling change — no runtime behaviour or visuals differ.
         */
        manualChunks(id) {
          if (id.includes('node_modules/three/examples/')) {
            return 'three-gltf';
          }

          if (id.includes('node_modules/three/')) {
            return 'three-vendor';
          }
        },
      },
    },
  },
})
