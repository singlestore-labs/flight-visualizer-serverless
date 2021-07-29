module.exports = {
  outputDir: 'public',
  devServer: {
    port: 8000,
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      }
    }
  }
};
