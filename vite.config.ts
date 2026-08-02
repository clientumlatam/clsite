import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    publicDir: 'assets',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, '.'),
        // ── Neon Auth SDK shims ──────────────────────────────────────────────
        // @neondatabase/neon-js is blocked by Replit's firewall (better-auth
        // dependency). These aliases redirect the SDK imports to local shims
        // that implement the same API surface via our Express auth proxy.
        '@neondatabase/neon-js/auth/react/ui': path.resolve(__dirname, 'src/lib/neon-sdk/auth-react-ui.tsx'),
        '@neondatabase/neon-js/auth/react': path.resolve(__dirname, 'src/lib/neon-sdk/auth-react.tsx'),
        '@neondatabase/neon-js/auth': path.resolve(__dirname, 'src/lib/neon-sdk/auth.ts'),
        '@neondatabase/neon-js/ui/css': path.resolve(__dirname, 'src/lib/neon-sdk/ui-css.ts'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        // nzip2 is a huge, separate WordPress/PHP repo copied for reference only —
        // it is not part of this app and watching its ~29k files exhausts the
        // OS file-watcher limit (ENOSPC), crashing the dev server.
        ignored: [
          '**/nzip2/**',
          '**/clientum-exports/**',
          '**/.cache/**',
          '**/.local/**',
          '**/.replit',
          '**/attached_assets/**',
        ],
      },
      // Allow Replit's proxied preview domain
      allowedHosts: true as true,
    },
  };
});
