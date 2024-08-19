const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/home': {
        target: 'http://psuite:81',
        changeOrigin: true,
        pathRewrite: { '^/home': '' },
        logLevel: 'debug', 
      },
    },
  },
});
