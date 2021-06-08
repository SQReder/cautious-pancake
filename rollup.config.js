import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json"

export default {
  input: 'src/main.js',
  output: {
    dir: 'build',
    format: 'umd', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
    // manualChunks: (id) => {
    //   if (id.includes('hast')) {
    //     return 'hast'
    //   }
    // }
  },
  plugins: [
    json(),
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
  ]
};
