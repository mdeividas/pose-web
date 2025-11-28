import { defineConfig } from 'vite'
import circleDependency from 'vite-plugin-circular-dependency';
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin({
      include: '**/*.svg',
    }),
    circleDependency({
      outputFilePath: './circleDep.json',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    }
  }
})
