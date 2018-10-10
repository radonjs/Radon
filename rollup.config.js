import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'index.js',
  output: {
    file: 'build/bundle.js',
    format: 'cjs',
    sourcemap: 'inline',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify()
  ],
};