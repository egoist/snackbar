import { Config } from 'bili'

const config: Config = {
  input: {
    snackbar: 'src/index.ts'
  },
  output: {
    format: ['umd', 'umd-min', 'esm'],
    moduleName: 'snackbar',
    fileName({ format, minify }, defaultName) {
      if (format === 'umd') {
        return minify ? '[name].min.js' : '[name].js'
      }
      if (format === 'esm') {
        return '[name].es.js'
      }
      return defaultName
    }
  },
  babel: {
    minimal: true
  },
  plugins: {
    typescript2: {
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext'
        },
        include: ['src/']
      }
    }
  }
}

export default config
