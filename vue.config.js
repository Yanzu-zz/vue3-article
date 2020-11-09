module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://api.vikingship.xyz/api/',
        changOrigin: true, //设置允许跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
