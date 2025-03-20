import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  assetsInclude: [
    '**/*.gltf',
    '**/*.glb',
    '**/*.obj',
    '**/*.mtl'
  ],
  plugins: [
    tsconfigPaths(),
    glsl({
      compress: process.env.NODE_ENV === 'production',
      root: '/node_modules'
    })
  ]
})
