class WebpackTransformPlugins {
  apply (compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      for (let filename in compilation.assets) {
        let content = compilation.assets[filename].source() || ''
        let reg = /\/static\/base/i
        content = content.replace(reg, '/src/aaa.txt')
        // 重写指定输出模块
        compilation.assets[filename] = {
          source () {
            console.log('content', content)
            return content
          },
          size () {
            return content.length
          }
        }
      }
      cb()
    })
  }
}

module.exports = WebpackTransformPlugins
