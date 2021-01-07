
# webpack 5.x 新特性

- 使用**持久缓存(Persistent Caching)**，提升构建性能
- 使用更优的算法(algorithms)和默认值(defaults)，提升 Long Term Caching
- 利用 Tree Shaking 和代码生成(Code Generation),减小 bundle 包的体积
- 对 web 具有更好的兼容性
- 清理内部结构，不引入任何 breaking changes
- 增加 breaking change 来为将来的功能特性做准备，使 v5 版本得到长期支持
- node.js 最低支持版本号已从 6 -> 10.13.0(LTS)



## 主要变更点（Margin Changes）

### 一、 移除（Removals）

1.1 **Deprecated Items**

> 将 v4 版本中，将所有处于 deprecated 的条目进行移除

1.2 **Deprecation Code**

> 移除 v4 版本中弃用的代码

1.3 **Syntax deprecated**

`require.include` 语法已经被弃用

1.4 **Automactic Node.js Polyfill Removed**

> 背景: 在设计初期，webapck 目标是要在浏览器端运行 nodejs.js 模块，但是目前大多数 module 主要被用来服务前端。webpack 4.x 自带了 node.js 核心模块的 polyfill，一旦使用其中任意一个模块(例如: `crypto`)，就会应用 polyfill.

尽管，上述设计初衷是为了更好的在浏览器端使用 node.js 模块，但同时也会引入庞大的 polyfill 打入 bundle 包中，显示这是没有必要的。

**变更迁移:**

- 尽可能使用与前端兼容的模块
- 手动添加 node.js 核心模块的 polyfill
- 在 packages.json 中使用 browser 字段，来声明 package 的前端兼容性。
### 二、Long Term Caching

2.1 明确 chunk, module ids, export names

新的算法已经支持了 Long Term Caching, 在 prodution 模式中，默认开启。

```js
{
  chunkIds: "deterministic",
  moduleIds: "deterministic",
  mangleExports: "deterministic"
}
```

The algorithms assign short (3 or 4 characters) numeric IDs to modules and chunks and short (2 characters) names to exports in a deterministic way. This is a trade-off between bundle size and long term caching.


2.2 Real Content Hash

当配置为: [`contenthash`] 时，webpack 5 将使用文件内容的 real hash. 此前，仅对内部结构进行 hash。这种方式将在执行**修改代码注释**和**变量重命名**的操作时，可以提升长期缓存的效果。


### 三、Development Support

3.1 **Named Chunk IDs**

A new named chunk id algorithm enabled by default in development mode gives chunks (and filenames) human-readable names. A Module ID is determined by its path, relative to the context. A Chunk ID is determined by the chunk's content.

3.2 **Module Federation**

模块联合，是 webpack 5.x 新支持的特性，它允许多个 webpack 构建同时协同工作。

### 四、web 新的平台特性

- **JSON modules**
- **Asset modules**
- **import meta**
- **Native Worker support**
- **Uris**
- **Async modules**
- **Externals**


### 五、Node.js 新的 Ecosystem Features

5.1 Resolving

package.json 文件现在已经支持 `exports` 和 `imports` 字段。


### 六、优化（Optimization）


6.1 Nested tree-shaking

webpack 现在可以跟踪到导出的嵌套属性，这将会优化 tree-shaking 性能。

```js
// inner.js
export const a = 1;
export const b = 2;

// module.js
import * as inner from "./inner";
export { inner }

// user.js
import * as module from "./module";
console.log(module.inner.a);
```

`export b` 变量，在生产环境模式下，被剔除掉。



### 七、性能（Performance）

7.1 **持久缓存（Persistent Caching）**

现在有一个 cache 文件系统，可以通过下面的配置启用:

```js
cache: {
  // 1. 设置 Cache 类型为 filesystem
  type: "filesystem",
  buildDependencies: {
    // 2. 设置 config 配置，当 config 发生变更时，使缓存失效
    config: [__filename]
  }
}
```

7.2 Compiler Idle and Close




webpack 5.x 变更记录，请参考: 

- [changelog-v5](https://github.com/webpack/changelog-v5/blob/master/README.md)
- [migration guild](https://github.com/webpack/changelog-v5/blob/master/MIGRATION%20GUIDE.md)