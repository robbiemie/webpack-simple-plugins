# 深入理解 webpack plgins

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

`compiler` 是一个编辑器实例，在 `webpack` 的每个进程中只会创建一个对象，它用来创建构建对象 `compilation`.

- `options` **配置属性**

`webpack` 在运行时，第一件事就是读取并解析配置文件，然后将配置赋值给 `Compiler` 实例。

```javascript
compiler = new Compiler();
// 其他代码..
compiler.options = new WebpackOptionsApply().process(options, compiler);  // 传入 compiler 对象

```

然后，我们可以通过传入的 `compiler` 对象，获取到 `webpack` 的配置。

```javascript
class CustomPlugin {    
  constructor() {}    
  // 传入 compiler 对象
  apply(compiler) {        
    compiler.plugin("run", (compiler) => {            
      console.log(compiler.options)        
    })    
  }
}

```

- **输入输出**

`compiler` 实例也会初始化输入输出，分别是 `inputFileSystem` 和 `outputFileSystem` 属性，本质上这两个属性都是对象的 `fs` 对象。

需要注意的是: 当在 `watch`模式下， `outputFileSystem` 会被重写为内存输出对象，即该对象只会保存在内存中，不会映射真实的文件对象。

因此，如果需要进行**文件读写**操作时，可以通过这两个属性实现。

```javascript
// https://github.com/webpack/webpack/blob/master/lib/Compiler.js#L501
class Compiler extends Tapable {    
  // 其他代码..    
  createChildCompiler(compilation, compilerName, compilerIndex, outputOptions, plugins) {      
    // 创建子编译器  
    const childCompiler = new Compiler();        
    if(Array.isArray(plugins)) {            
      plugins.forEach(plugin => childCompiler.apply(plugin));        
    }        
    for(const name in this._plugins) {   
      // 过滤以下任务点         
      if(["make", "compile", "emit", "after-emit", "invalid", "done", "this-compilation"].indexOf(name) < 0)            
        childCompiler._plugins[name] = this._plugins[name].slice();        
    }        
    childCompiler.name = compilerName;        
    childCompiler.outputPath = this.outputPath;
    // 输入输出        
    childCompiler.inputFileSystem = this.inputFileSystem;        
    childCompiler.outputFileSystem = null;        
    // 省略部分逻辑...    
    childCompiler.options = Object.create(this.options);        
    childCompiler.options.output = Object.create(childCompiler.options.output);        
    for(const name in outputOptions) {            
      childCompiler.options.output[name] = outputOptions[name];        
    }        
    childCompiler.parentCompilation = compilation;        
    compilation.applyPlugins("child-compiler", childCompiler, compilerName, compilerIndex);        
    return childCompiler;    
  }
}

```


### compilation

> `compiler` 对象作为构建入口对象，负责解析全局的 `webpack` 配置，再将配置应用到 `compilation` 对象中。 `compilation` 包含了每次 `build` 后的详细信息，包括编译结果、错误信息、模块(modules)、编译后的资源、改变的文件和依赖等。同时，它提供了很多事件钩子(hook).

在 `compilation` 对象中，有以下几个重要的属性:

- `modules` 所有解析后的模块
- `chunks` 所有的chunk
- `assets` 记录要生成的文件





## 参考文档


- [webpack 官方示例](https://webpack.docschina.org/contribute/writing-a-plugin/)
- [webpack-hot-middleware 源码实现](https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/middleware.js#L6)
- [开发一个简单的 webpack 插件](https://kirainmoe.com/blog/post/webpack-plugin-developing-tutorial/)
- [webpack-compiler-and-compilation](https://github.com/liangklfangl/webpack-compiler-and-compilation)
- [webpack的基本架构和构建流程](https://cloud.tencent.com/developer/article/1006353)
- [webpack的核心对象](https://cloud.tencent.com/developer/article/1030740)
- [Webpack插件开发简要](http://www.cnblogs.com/sampapa/p/6958166.html)