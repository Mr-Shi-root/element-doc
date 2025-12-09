# 业务组件库设计文档

## 一、项目背景与目标

### 1.1 业务场景
公司有多个 Vue2 项目，都使用 Element UI 作为基础 UI 库。在实际开发中，发现很多业务组件在不同项目中重复开发，例如：
- 商品选择器
- 图片上传器
- 用户选择器
- 地址选择器
等等...

### 1.2 设计目标
1. **复用性**：封装通用业务逻辑，避免重复开发
2. **可维护性**：统一维护，修复 bug 后所有项目受益
3. **灵活性**：支持按需引入，不增加项目体积
4. **易用性**：API 设计简洁，开箱即用
5. **扩展性**：方便添加新组件，支持自定义配置

## 二、技术选型

### 2.1 为什么选择 Rollup 而不是 Webpack？

| 对比项 | Rollup | Webpack |
|--------|--------|---------|
| **定位** | 专为库打包设计 | 专为应用打包设计 |
| **输出代码** | 简洁，无运行时代码 | 包含大量运行时代码 |
| **Tree-shaking** | 原生支持，效果更好 | 支持但不如 Rollup |
| **多格式输出** | 轻松输出 ES/CJS/UMD | 需要多次配置 |
| **打包体积** | 更小 | 相对较大 |
| **配置复杂度** | 简单直观 | 相对复杂 |

**结论**：对于组件库这种场景，Rollup 是更好的选择。

### 2.2 输出格式设计

我们输出三种格式，满足不同使用场景：

```
1. ES Module (es/index.js)
   - 用途：现代构建工具（Webpack、Vite）
   - 优势：支持 Tree-shaking，按需加载
   - 使用者：import { ProductSelector } from 'xxx'

2. CommonJS (lib/index.js)
   - 用途：Node.js 环境、旧版构建工具
   - 优势：兼容性好
   - 使用者：const { ProductSelector } = require('xxx')

3. UMD (dist/index.js)
   - 用途：浏览器直接引入
   - 优势：无需构建工具
   - 使用者：<script src="xxx"></script>
```

### 2.3 依赖管理策略

使用 `peerDependencies` 而不是 `dependencies`：

```json
{
  "peerDependencies": {
    "vue": "^2.6.0",
    "element-ui": "^2.15.0"
  }
}
```

**原因**：
1. **避免重复打包**：Vue 和 Element UI 不会被打包进组件库
2. **版本一致性**：确保使用者项目中的 Vue 版本一致
3. **减小体积**：组件库体积更小
4. **避免冲突**：不会出现多个 Vue 实例的问题

## 三、架构设计

### 3.1 目录结构设计

```
element-doc/
├── packages/                    # 源码目录
│   ├── components/              # 组件目录
│   │   ├── ProductSelector/     # 商品选择器
│   │   │   ├── index.vue       # 组件实现
│   │   │   └── index.js        # 组件导出（带 install 方法）
│   │   └── ImageUploader/       # 图片上传器
│   │       ├── index.vue
│   │       └── index.js
│   ├── utils/                   # 工具函数（预留）
│   └── index.js                 # 主入口文件
├── examples/                    # 示例文件
│   └── index.html
├── lib/                         # CommonJS 输出（构建生成）
├── es/                          # ES Module 输出（构建生成）
├── dist/                        # UMD 输出（构建生成）
├── rollup.config.js             # Rollup 配置
├── .babelrc                     # Babel 配置
└── package.json                 # 项目配置
```

**设计思路**：
- `packages/` 作为源码目录，清晰分离源码和构建产物
- 每个组件独立目录，便于维护和按需加载
- `index.js` 提供 `install` 方法，支持 `Vue.use()` 全局注册

### 3.2 组件导出设计

#### 单个组件导出（[packages/components/ProductSelector/index.js](packages/components/ProductSelector/index.js)）

```javascript
import ProductSelector from './index.vue';

// 提供 install 方法，支持 Vue.use()
ProductSelector.install = function(Vue) {
  Vue.component(ProductSelector.name, ProductSelector);
};

export default ProductSelector;
```

#### 主入口导出（[packages/index.js](packages/index.js)）

```javascript
import ProductSelector from './components/ProductSelector';
import ImageUploader from './components/ImageUploader';

const components = [ProductSelector, ImageUploader];

// 全局安装方法
const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;

  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

// 支持浏览器直接引入（CDN）
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// 默认导出（支持 Vue.use()）
export default {
  version: '1.0.0',
  install,
  ProductSelector,
  ImageUploader
};

// 按需导出（支持 import { ProductSelector } from 'xxx'）
export {
  ProductSelector,
  ImageUploader
};
```

**设计思路**：
1. **支持三种使用方式**：
   - 完整引入：`Vue.use(ElementBusinessComponents)`
   - 按需引入：`import { ProductSelector } from 'xxx'`
   - CDN 引入：自动注册到 `window.Vue`

2. **防止重复安装**：通过 `install.installed` 标记

## 四、组件设计原则

### 4.1 商品选择器（ProductSelector）设计

#### 核心功能
1. **单选/多选模式**
2. **搜索功能**
3. **分页功能**
4. **支持静态数据和动态数据**

#### API 设计思路

```vue
<product-selector
  v-model="selectedProduct"
  :multiple="false"
  :fetch-data="fetchProductList"
  @change="handleChange"
/>
```

**Props 设计原则**：
1. **v-model 绑定**：符合 Vue 习惯
2. **灵活的数据源**：
   - `data` prop：静态数据
   - `fetchData` prop：动态获取（函数）
3. **可配置性**：
   - `valueKey`、`labelKey`：适配不同数据结构
   - `dialogWidth`、`tableHeight`：自定义样式
4. **事件设计**：
   - `change`：返回完整对象，而不仅仅是 ID
   - 便于使用者获取更多信息

#### 实现细节

```javascript
// 数据获取的灵活性
async loadData() {
  if (this.fetchData && typeof this.fetchData === 'function') {
    // 动态获取
    const result = await this.fetchData({
      keyword: this.searchKeyword,
      page: this.currentPage,
      pageSize: this.pageSize
    });
    this.productList = result.list;
    this.total = result.total;
  } else {
    // 使用静态数据
    this.productList = this.data;
    this.total = this.data.length;
  }
}
```

**设计亮点**：
- 统一的参数格式：`{ keyword, page, pageSize }`
- 统一的返回格式：`{ list, total }`
- 使用者只需关注业务逻辑，不需要关心组件内部实现

### 4.2 图片上传器（ImageUploader）设计

#### 核心功能
1. **单图/多图上传**
2. **图片预览**
3. **文件类型和大小校验**
4. **自定义校验**

#### API 设计思路

```vue
<image-uploader
  v-model="imageUrl"
  action="/api/upload"
  :headers="uploadHeaders"
  :max-size="5"
  :before-upload="customValidate"
  @success="handleSuccess"
/>
```

**Props 设计原则**：
1. **基于 Element UI Upload**：保持 API 一致性
2. **增强功能**：
   - 自动处理 v-model 绑定
   - 内置常用校验（类型、大小）
   - 支持自定义校验
3. **灵活的值类型**：
   - 单图：`string`
   - 多图：`array`

#### 实现细节

```javascript
// 自动更新 v-model
updateValue(fileList) {
  const urls = fileList
    .filter(file => file.status === 'success' && file.url)
    .map(file => file.url);

  if (this.multiple) {
    this.$emit('input', urls);
    this.$emit('change', urls);
  } else {
    const value = urls[0] || '';
    this.$emit('input', value);
    this.$emit('change', value);
  }
}
```

**设计亮点**：
- 自动处理单图/多图的值类型
- 过滤掉上传失败的文件
- 同时触发 `input` 和 `change` 事件

## 五、构建配置设计

### 5.1 Rollup 配置（[rollup.config.js](rollup.config.js)）

```javascript
export default {
  input: 'packages/index.js',
  output: {
    file: format === 'es' ? 'es/index.js' : ...,
    format: format,
    name: 'ElementBusinessComponents',  // UMD 全局变量名
    exports: 'named',
    globals: {
      vue: 'Vue',
      'element-ui': 'ELEMENT'
    }
  },
  plugins: [
    peerDepsExternal(),  // 自动排除 peerDependencies
    resolve(),           // 解析 node_modules
    vue(),              // 处理 .vue 文件
    postcss(),          // 处理 CSS
    commonjs(),         // 转换 CommonJS
    babel(),            // ES6+ 转译
    terser()            // 压缩（仅 UMD）
  ],
  external: format === 'umd' ? ['vue', 'element-ui'] : []
}
```

**设计思路**：
1. **插件顺序很重要**：
   - `peerDepsExternal` 最先，排除外部依赖
   - `vue` 处理 .vue 文件
   - `babel` 转译 ES6+
   - `terser` 最后压缩

2. **external 配置**：
   - ES/CJS 格式：自动处理（通过 peerDepsExternal）
   - UMD 格式：手动指定，避免打包 Vue 和 Element UI

3. **globals 配置**：
   - UMD 格式需要指定全局变量名
   - `vue` → `Vue`
   - `element-ui` → `ELEMENT`

### 5.2 Babel 配置（[.babelrc](.babelrc)）

```json
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false,  // 保留 ES Module，让 Rollup 处理
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"  // 避免辅助函数重复
  ]
}
```

**设计思路**：
1. **`modules: false`**：保留 ES Module 语法，让 Rollup 进行 Tree-shaking
2. **`@babel/plugin-transform-runtime`**：
   - 避免辅助函数（如 `_extends`）在每个文件中重复
   - 减小打包体积

## 六、使用方式设计

### 6.1 完整引入

```javascript
import Vue from 'vue';
import ElementBusinessComponents from '@company/element-business-components';

Vue.use(ElementBusinessComponents);
```

**适用场景**：项目中使用了大部分组件

### 6.2 按需引入（推荐）

```javascript
import { ProductSelector, ImageUploader } from '@company/element-business-components';

Vue.component(ProductSelector.name, ProductSelector);
Vue.component(ImageUploader.name, ImageUploader);
```

**适用场景**：只使用少数几个组件，减小打包体积

### 6.3 CDN 引入

```html
<script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<script src="./dist/index.js"></script>
```

**适用场景**：快速原型开发、演示页面

## 七、扩展性设计

### 7.1 添加新组件的流程

1. **创建组件目录**：`packages/components/NewComponent/`
2. **实现组件**：`index.vue`
3. **添加 install 方法**：`index.js`
4. **在主入口导出**：`packages/index.js`
5. **重新构建**：`npm run build`

### 7.2 工具函数设计（预留）

```
packages/
├── utils/
│   ├── validate.js      # 校验工具
│   ├── format.js        # 格式化工具
│   └── request.js       # 请求封装
```

**设计思路**：
- 提取组件中的通用逻辑
- 可以单独导出使用
- 便于单元测试

## 八、最佳实践

### 8.1 组件设计原则

1. **单一职责**：每个组件只做一件事
2. **高内聚低耦合**：组件内部逻辑完整，对外依赖少
3. **可配置性**：通过 props 提供配置选项
4. **可扩展性**：通过 slot 支持自定义内容
5. **向后兼容**：API 变更要考虑兼容性

### 8.2 API 设计原则

1. **符合 Vue 习惯**：使用 v-model、事件等
2. **符合 Element UI 风格**：保持 API 一致性
3. **合理的默认值**：开箱即用
4. **清晰的命名**：见名知意
5. **完善的文档**：每个 prop 和 event 都有说明

### 8.3 性能优化

1. **按需加载**：支持 Tree-shaking
2. **避免重复打包**：使用 peerDependencies
3. **代码分割**：每个组件独立文件
4. **懒加载**：大型组件支持异步加载

## 九、未来规划

### 9.1 短期目标
- [ ] 添加更多业务组件（用户选择器、地址选择器等）
- [ ] 添加单元测试（Jest + Vue Test Utils）
- [ ] 完善文档和示例

### 9.2 中期目标
- [ ] 添加 TypeScript 支持
- [ ] 搭建组件文档站点（VuePress）
- [ ] 配置 CI/CD 自动发布

### 9.3 长期目标
- [ ] 支持主题定制
- [ ] 国际化支持
- [ ] Vue3 版本迁移

## 十、总结

这个业务组件库的设计核心思想是：

1. **复用优先**：避免重复造轮子
2. **灵活可配**：适应不同业务场景
3. **简单易用**：降低使用门槛
4. **性能优先**：按需加载，减小体积
5. **持续迭代**：不断完善和优化

通过合理的架构设计和技术选型，我们构建了一个高质量、易维护、可扩展的业务组件库，能够有效提升团队的开发效率。
