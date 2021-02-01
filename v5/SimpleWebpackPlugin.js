// 声明 webpack 插件
function SimpleWebpackPlugin (options) {
  console.log('options', options)
}
/**
 * 插件的原型上，定义 apply 方法
 * @param {*} compiler 返回一个 compiler 对象
 * compiler 对象表示 webpack 的完整配置，可以获取到 loader、plugin、options
 * 插件和 webpack 也是通过 compiler 对象进行关联的
 */
SimpleWebpackPlugin.prototype.apply = function(compiler) {
  // 挂载 webpack 提供的 Event Hook
  // compilation 对象表示一次资源版本构建，即当检测到某一个文件改变，就会构建一个新的 compilation
  // 一个  compilation 对象可以获取到当前模块的资源文件、编译生成资源、变更的文件，以及被跟踪的状态信息
  /**
   * webpack 4+ 使用新的插件系统
   */
  const hooks = compiler.hooks
  if(hooks) {
    hooks.emit.tap('simle-webpack-plugin', compilation => {
      console.log('compilation')
    })
    hooks.done.tap('simple-webpack-plugin', stats => {
      // console.log('tap', stats)
      console.log('stats')
    })
  } else {
    // 兼容逻辑
    compiler.plugin('done', function(compilation, callback) {
      // 执行相关逻辑
      console.log('hello world')
      callback()
    })
  }
}

module.exports = SimpleWebpackPlugin