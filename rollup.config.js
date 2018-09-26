import typescript from 'rollup-plugin-typescript2'
import cli from 'rollup-plugin-cli';
import pkg from './package.json'

export default [{
  input: 'src/typeorm-seeding.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
},{
  input: 'src/cli.ts',
  output: [
    {
      file: pkg.bin.seed,
      format: 'umd',
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    cli(),
  ],
}]
