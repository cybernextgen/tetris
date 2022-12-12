import { rollupPluginHTML as html } from '@web/rollup-plugin-html'
import { terser } from '@el3um4s/rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'

export default {
  input: 'src/frontend/index.html',
  output: {
    format: 'iife',
    dir: 'dist'
  },
  watch: {
    include: 'src/frontend/**'
  },
  plugins: [
    postcss({
      plugins: [cssnano()],
      extensions: ['.css']
    }),
    typescript({
      noForceEmit: true,
      cacheDir: '.rollup.tscache',
      esModuleInterop: true,
      target: 'ES2022',
      module: 'ES2022'
    }),
    terser(),
    html({
      minify: true
    })
  ]
}
