import typescript from 'rollup-plugin-typescript2'
import cli from 'rollup-plugin-cli';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import pkg from './package.json'

export default [{
  input: 'src/typeorm-seeding.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    }
  ],
  onwarn: function (warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    warn(warning);
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    commonjs(),
    globals(),
    builtins(),
  ],
}]
