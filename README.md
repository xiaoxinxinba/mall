
> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# 打包正式环境
npm run build

# 打包测试环境
npm run build -- test

# 打包预发布环境
npm run build -- pre

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 自定义组件
``` 
# 接口调用请参考src/api/test

# 接口host地址为默认地址请勿随意修改 如需添加新的接口地址请参考 config/vuex/state/api/api.dev.js 文件


# 如需添加本地或者其他的接口地址文件 请到config/vuex/state/api文件夹新建文件到config/vuex/state里面的api.js配置相应的路径
打包方式 列：npm run build -- 0.56
(0.56为api.js里面自定的名称)

# 如需查看示例用法请参考HelloWorld.vue文件

#element组件 使用请到config/element添加相应的组件

```
#### lodash 使用方式 先导入要使用的lodash组件导入方式 import _filter from 'lodash/fliter'
### [lodash参考链接](https://lodash.com/docs/4.17.11)

