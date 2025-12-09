import vue from 'rollup-plugin-vue';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';

const format = process.env.FORMAT || 'es';

const config = {
  input: 'packages/index.js',
  output: {
    file: format === 'es' ? 'es/index.js' : format === 'cjs' ? 'lib/index.js' : 'dist/index.js',
    format: format === 'umd' ? 'umd' : format,
    name: 'ElementBusinessComponents',
    exports: 'named',
    globals: {
      vue: 'Vue',
      'element-ui': 'ELEMENT'
    }
  },
  plugins: [
    // 自动将 peerDependencies 标记为 external
    peerDepsExternal(),

    // 解析 node_modules 中的模块
    resolve({
      extensions: ['.js', '.vue']
    }),

    // 处理 Vue 单文件组件
    vue({
      css: true,
      compileTemplate: true
    }),

    // 处理 CSS
    postcss({
      extract: format === 'umd' ? 'dist/index.css' : false,
      minimize: format === 'umd'
    }),

    // 转换 CommonJS 模块
    commonjs(),

    // Babel 转译
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions: ['.js', '.vue']
    }),

    // UMD 格式压缩代码
    format === 'umd' && terser()
  ].filter(Boolean),

  external: format === 'umd' ? ['vue', 'element-ui'] : []
};

export default config;
