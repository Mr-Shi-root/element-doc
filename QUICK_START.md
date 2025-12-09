# 快速开始指南

## 1. 安装依赖

```bash
npm install
```

## 2. 构建组件库

```bash
# 构建所有格式（ES Module + CommonJS + UMD）
npm run build

# 或者单独构建某个格式
npm run build:esm   # ES Module 格式
npm run build:cjs   # CommonJS 格式
npm run build:umd   # UMD 格式（用于浏览器直接引入）
```

构建完成后会生成以下目录：
- `es/` - ES Module 格式，支持 tree-shaking
- `lib/` - CommonJS 格式，用于 Node.js 环境
- `dist/` - UMD 格式，可在浏览器中直接使用

## 3. 在项目中使用

### 方式一：完整引入

```javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ElementBusinessComponents from '@company/element-business-components';

Vue.use(ElementUI);
Vue.use(ElementBusinessComponents);
```

### 方式二：按需引入（推荐）

```javascript
import { ProductSelector, ImageUploader } from '@company/element-business-components';

Vue.component(ProductSelector.name, ProductSelector);
Vue.component(ImageUploader.name, ImageUploader);
```

### 方式三：浏览器直接引入

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
</head>
<body>
  <div id="app">
    <product-selector v-model="product"></product-selector>
  </div>

  <script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <script src="./dist/index.js"></script>

  <script>
    new Vue({
      el: '#app',
      data: { product: '' }
    });
  </script>
</body>
</html>
```

## 4. 测试示例

构建完成后，可以在浏览器中打开 `examples/index.html` 查看组件示例。

## 5. 发布到 npm

### 5.1 登录 npm

```bash
npm login
```

### 5.2 修改包名

在 [package.json](package.json:2) 中修改 `name` 字段为你的组织或个人命名空间：

```json
{
  "name": "@your-company/element-business-components"
}
```

### 5.3 发布

```bash
npm publish --access public
```

## 6. 在其他项目中安装使用

```bash
npm install @your-company/element-business-components --save
```

## 7. 开发新组件

### 7.1 创建组件目录

在 `packages/components/` 下创建新组件目录，例如 `UserSelector`：

```bash
mkdir -p packages/components/UserSelector
```

### 7.2 创建组件文件

创建 `packages/components/UserSelector/index.vue`：

```vue
<template>
  <div class="user-selector">
    <!-- 组件内容 -->
  </div>
</template>

<script>
export default {
  name: 'UserSelector',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  }
};
</script>

<style scoped>
.user-selector {
  /* 样式 */
}
</style>
```

### 7.3 创建组件入口文件

创建 `packages/components/UserSelector/index.js`：

```javascript
import UserSelector from './index.vue';

UserSelector.install = function(Vue) {
  Vue.component(UserSelector.name, UserSelector);
};

export default UserSelector;
```

### 7.4 在主入口文件中导出

在 [packages/index.js](packages/index.js) 中添加新组件：

```javascript
import UserSelector from './components/UserSelector';

const components = [
  ProductSelector,
  ImageUploader,
  UserSelector  // 添加新组件
];

export {
  ProductSelector,
  ImageUploader,
  UserSelector  // 导出新组件
};
```

### 7.5 重新构建

```bash
npm run build
```

## 8. 项目结构说明

```
element-doc/
├── packages/              # 组件源码
│   ├── components/        # 组件目录
│   │   ├── ProductSelector/
│   │   │   ├── index.vue
│   │   │   └── index.js
│   │   └── ImageUploader/
│   │       ├── index.vue
│   │       └── index.js
│   ├── utils/            # 工具函数
│   └── index.js          # 主入口文件
├── examples/             # 示例文件
│   └── index.html
├── lib/                  # CommonJS 构建输出（git ignore）
├── es/                   # ES Module 构建输出（git ignore）
├── dist/                 # UMD 构建输出（git ignore）
├── rollup.config.js      # Rollup 配置
├── .babelrc              # Babel 配置
├── package.json          # 项目配置
└── README.md             # 文档
```

## 9. 常见问题

### Q: 为什么选择 Rollup 而不是 Webpack？

A: Rollup 更适合打包组件库：
- 生成的代码更简洁，没有 webpack 的运行时代码
- Tree-shaking 效果更好
- 可以同时输出多种格式（ES/CJS/UMD）
- 打包体积更小

### Q: peerDependencies 是什么？

A: peerDependencies 表示组件库依赖的包，但不会被打包进组件库中。使用者需要在自己的项目中安装这些依赖。这样可以：
- 避免重复打包 Vue 和 Element UI
- 确保使用者项目中的 Vue 版本一致
- 减小组件库体积

### Q: 如何调试组件？

A: 可以使用开发模式：

```bash
npm run dev
```

这会启动 Rollup 的 watch 模式，文件修改后会自动重新构建。然后在浏览器中打开 `examples/index.html` 查看效果。

### Q: 如何在公司内部使用？

A: 有几种方式：

1. **发布到私有 npm 仓库**（推荐）
   - 使用 Verdaccio 或公司的私有 npm 服务
   - 修改 `.npmrc` 指向私有仓库

2. **使用 Git 依赖**
   ```json
   {
     "dependencies": {
       "@company/element-business-components": "git+ssh://git@github.com:Mr-Shi-root/element-doc.git"
     }
   }
   ```

3. **本地 link**（仅用于开发）
   ```bash
   # 在组件库目录
   npm link

   # 在使用项目目录
   npm link @company/element-business-components
   ```

## 10. 下一步

- 添加更多业务组件
- 编写单元测试
- 添加 TypeScript 支持
- 搭建组件文档站点（使用 VuePress 或 Vite）
- 配置 CI/CD 自动发布
