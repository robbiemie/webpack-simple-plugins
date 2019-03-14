class WebpackTransformPlugins {
  apply (compiler) {
    compiler.hooks.emit.tap('WebpackTransformPlugins', (compilation, cb) => {
      console.log('emit start', compilation.assets)
    })
  }
}

module.exports = WebpackTransformPlugins
