const VUE_APP_BASE_API = '^' + process.env.VUE_APP_BASE_API;
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  // 代理跨域服务器
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888',
      }
    }
  },
  //路径前缀
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  configureWebpack: {
  output: {
    sourcePrefix: ' '
  },
  amd: {
    toUrlUndefined: true
  },
  plugins: [
    // new CopyWebpackPlugin([ { from: path.join('./public', 'model'), to: 'model3D'}])
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify('./')
    })
  ],
    module: {
    unknownContextCritical: false
  }
}
};