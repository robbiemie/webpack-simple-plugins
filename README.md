# webpack-simple-plgins

## 插件结构

`webpack plugins` 开发有以下几个步骤:


- 具名 `Javascript` 函数
- 定义一个原型方法 `apply`
- 定义一个 `compiler` [钩子事件](https://webpack.docschina.org/api/compiler-hooks/) (`emit`)
- 通过 `compilation` 对象，执行相关操作
- 执行结束后，调用 `callback` 函数


```javascript

class WebpackPluginsXXX {
  // 新版本webpack plugins 开发
  apply (compiler) {

     compiler.hooks.done.tap('MyExampleWebpackPlugin', (compilation, cb) => {
      // ...
      console.log('通过 compilation 对象，执行相关操作')
      cb()
    })
  }
}

// 注意: 旧版本webpack plugins开发

class WebpackPluginsXXX {
  //   
  apply (compiler) {
    // 调用hook方式不同
    compiler.plugin('emit', (compilation, cb) => {
      // ...
      console.log('通过 compilation 对象，执行相关操作')
      cb()
    })
  }
}
```


## 基础概念


![](https://camo.githubusercontent.com/e4bf7f4dcb17030f66185954e9cd4d3df31c8d8b/68747470733a2f2f696d672e616c6963646e2e636f6d2f7470732f544231475647464e585858585861546170585858585858585858582d343433362d343234342e6a7067)


> 开发 `webpack plugins` 时，有几个重要的概念: `Tapable`、 `compiler` 和 `compilation`.


### Tapable

`Tapable` 提供了 `webpack` 中基于任务点的架构基础，它将提供任务点注册(register)以及触发(emitter)的方式。

- `Tapable` 简单的示例:

```javascript
let obj = new Tapable()
obj.plugin("name", (params1, params2) => {
  console.log(params1) // 1    
  console.log(params2) // params
})
obj.applyPlugins("name", 1, "params")

```

- `webpack` 中调用自定义插件就是调用 `Compiler` 实例对象(继承自`Tapable`)的`apply` 方法:

```javascript
// webpack.config.js
module.exports = {    
  plugins: [{
    apply(compiler) {
      compiler.plugin("done", (stat) => { 
        console.log("it works!")     
      }) 
  }
}]}

if(options.plugins && Array.isArray(options.plugins)) {
  compiler.apply.apply(compiler, options.plugins);
}

```

### compiler

### compilation



## 参考文档


- [webpack 官方示例](https://webpack.docschina.org/contribute/writing-a-plugin/)
- [webpack-hot-middleware 源码实现](https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/middleware.js#L6)
- [开发一个简单的 webpack 插件](https://kirainmoe.com/blog/post/webpack-plugin-developing-tutorial/)
- [webpack-compiler-and-compilation](https://github.com/liangklfangl/webpack-compiler-and-compilation)
- [玩转 webpack](https://cloud.tencent.com/developer/article/1030740)