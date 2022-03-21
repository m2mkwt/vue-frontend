module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '/login_processing': {
        target: 'http://localhost:8082'
      },
      '/api/*': {
        target: 'http://localhost:8082'
      },
      '/commonCode/*': {
        target: 'http://localhost:8082'
      },
      '/deptMember/*': {
        target: 'http://localhost:8082'
      }
    }
  }
}
