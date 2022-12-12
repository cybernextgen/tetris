import { terser } from '@el3um4s/rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/backend/tetris.ts',
  output: {
    format: 'iife',
    dir: 'dist'
  },
  watch: {
    include: 'src/backend/**'
  },
  plugins: [
    typescript({
      noForceEmit: true,
      cacheDir: '.rollup.tscache',
      esModuleInterop: true,
      compilerOptions: {
        module: 'nodenext'
      }
    }),
    terser()
  ]
}
