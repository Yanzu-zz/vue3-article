# 项目基础代码架构说明

* 如果对你有帮助的话，留个 star 呗~

#### 包管理工具

* npm

#### 主要用到的库

* vue 全家桶 vue3 + vue-router + vuex + typescript
* http 请求: axios
* ui 库: bootstrap v5
* 提交规范: 普通手写 git
* 代码检查: eslint+eslint-typescript
* 测试用例: mocha, chai

#### 代码基础架构说明

``` 

|-- 根目录
    |-- dist 项目 build 之后的文件夹
    |-- public 项目静态资源，不经过 webpack，以及默认的模版，适合存放第三方压缩好的资源
    |-- src 主要的开发目录
    | |-- @types 项目共用的 type
    | |-- App.vue 页面渲染根节点
    | |-- main.ts 入口文件
    | |-- shims-vue.d.ts vue 文件类型的 type
    | |-- assets 存放静态资源
    | |-- components
    | | |-- ...普通模块，需要手动在需要的地方注册
    | |-- router 路由
    | | |-- index.ts 路由入口
    | |-- store vuex
    | | |-- index.ts store 入口
    | |-- helper 常用函数以及其他有用工具
    | | |-- index.ts
    | |-- views 页面级组件
    | |-- tests 组件测试页面
    |-- .eslintignore eslint 要忽略的文件夹
    |-- .eslintrc.js eslint 规则配置
    |-- .gitignore git 忽略的文件
    |-- README.md 项目说明
    |-- package.json npm 配置
    |-- tsconfig.json typescript 配置
    |-- typedoc.json 文档配置文件
    |-- vue.config.js vue-cli 脚手架配置文件
```

#### 网络请求

* [x] 基于具体业务逻辑再次封装网络请求（asyncAndCommit）

#### 数据状态管理

* [x] 支持持久化

#### UI 库

* [x] 添加 bootstrap v5（仅 css）
* [x] 将 createMessage 组件抽象成一个 hook 函数，实现调用函数式弹出消息

#### 插件与常用工具函数

* [x] 自定义 helper
* [x] 常用 useHook 

#### 配置

* [x] 使用 vue-cli 提供的默认 webpack 打包配置
* [x] 完成 tsconfig 相关配置

#### 开发工具

* [x] eslint 代码检查, 配置 prettier 格式化工具, 使检查规则和格式化规则一致

#### 文档

* [x] 暂无

#### 测试用例

* [x] 支持编写 js, ts 的测试用例

## 安装依赖

``` 

npm install
```

### 开发模式

``` 

npm run serve
```

### 生产环境

``` 

npm run build
```

### 测试用例

* helper 模块常规单元测试

``` 

npm run test:unit
```

### 更多问题

如果有问题，请提 issue 说明 => [传送门](https://github.com/Yanzu-zz/vue3-article).
