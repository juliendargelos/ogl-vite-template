/// <reference types="vite/client" />
/// <reference types="vite-plugin-glsl/ext" />

declare module '*.glb' {
  const url: string
  export default url
}

declare module '*.gltf' {
  const url: string
  export default url
}

declare module '*.obj' {
  const url: string
  export default url
}

declare module '*.mtl' {
  const url: string
  export default url
}
