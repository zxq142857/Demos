module.exports = {
  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // https://cli.vuejs.org/guide/webpack.html#simple-configuration
  configureWebpack: {
    externals: {
      swiper: 'Swiper',
      jquery: '$',
      axios: 'axios'
    }
  }
}
