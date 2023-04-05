const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/taiwanMap',
  transpileDependencies: true,
  configureWebpack: {
    module: {
      rules: [],
    },
  },
});
