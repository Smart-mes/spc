// const path = require('path');
// const url = 'http://192.168.1.128:8088'
const url = 'http://127.0.0.1:8888'

const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  // 不加密
  productionSourceMap: false,
  // 代理
  devServer: {
    proxy: {
      '/api': {
        target: url,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  // 全局配置sass
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/css/style.scss";`,
      },
    },
  },
  lintOnSave: false,
  // 压缩打包,gzip打包插件
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|svg)$/,
        threshold: 8192,
        minRatio: 0.8,
      }),
    ],
  },

}
