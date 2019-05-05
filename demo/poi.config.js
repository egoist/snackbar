const Prism = require('prismjs')

module.exports = {
  entry: './demo/index.ts',
  output: {
    dir: './demo/dist'
  },
  plugins: [
    {
      resolve: '@poi/typescript'
    }
  ],
  publicFolder: './demo/public',
  chainWebpack(config) {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vmark-loader')
      .loader('vmark-loader')
      .options({
        markdown: {
          highlight(code, lang) {
            return Prism.highlight(code, Prism.languages[lang], lang)
          }
        }
      })
  }
}
