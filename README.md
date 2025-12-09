# Element Business Components

基于 Vue2 + Element UI 的业务组件库，封装了常用的业务组件，提高开发效率。

## 特性

- 🚀 基于 Vue2 + Element UI 开发
- 📦 支持按需引入
- 🎨 开箱即用的业务组件
- 📝 完善的文档和示例
- 🔧 使用 Rollup 打包，支持 ES Module、CommonJS、UMD 多种格式

## 安装

```bash
npm install @company/element-business-components --save
# 或
yarn add @company/element-business-components
```

## 快速开始

### 完整引入

```javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ElementBusinessComponents from '@company/element-business-components';

Vue.use(ElementUI);
Vue.use(ElementBusinessComponents);
```

### 按需引入

```javascript
import Vue from 'vue';
import { ProductSelector, ImageUploader } from '@company/element-business-components';

Vue.component(ProductSelector.name, ProductSelector);
Vue.component(ImageUploader.name, ImageUploader);
```

## 组件列表

### ProductSelector 商品选择器

用于选择商品的业务组件，支持单选和多选，支持搜索和分页。

#### 基础用法

```vue
<template>
  <div>
    <product-selector
      v-model="selectedProduct"
      :fetch-data="fetchProductList"
      @change="handleProductChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedProduct: ''
    };
  },
  methods: {
    // 获取商品列表的方法
    async fetchProductList(params) {
      // params: { keyword, page, pageSize }
      const response = await this.$http.get('/api/products', { params });
      return {
        list: response.data.list,
        total: response.data.total
      };
    },
    handleProductChange(product) {
      console.log('选中的商品：', product);
    }
  }
};
</script>
```

#### 多选模式

```vue
<template>
  <product-selector
    v-model="selectedProducts"
    :multiple="true"
    :fetch-data="fetchProductList"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedProducts: []
    };
  }
};
</script>
```

#### 使用静态数据

```vue
<template>
  <product-selector
    v-model="selectedProduct"
    :data="productList"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedProduct: '',
      productList: [
        {
          productId: '1',
          productName: '商品1',
          productCode: 'P001',
          price: 99.00,
          stock: 100
        },
        // ...更多商品
      ]
    };
  }
};
</script>
```

#### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | string / number / array | — | — |
| multiple | 是否多选 | boolean | — | false |
| placeholder | 占位文本 | string | — | 请选择商品 |
| searchPlaceholder | 搜索占位文本 | string | — | 请输入商品名称或编码 |
| title | 对话框标题 | string | — | 选择商品 |
| dialogWidth | 对话框宽度 | string | — | 800px |
| tableHeight | 表格高度 | string / number | — | 400 |
| disabled | 是否禁用 | boolean | — | false |
| data | 静态数据源 | array | — | [] |
| fetchData | 获取数据的方法 | function | — | null |
| valueKey | 值的键名 | string | — | productId |
| labelKey | 显示的键名 | string | — | productName |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 选中值发生变化时触发 | 选中的商品对象或数组 |

---

### ImageUploader 图片上传器

用于上传图片的业务组件，支持单图和多图上传，支持预览和删除。

#### 基础用法

```vue
<template>
  <div>
    <image-uploader
      v-model="imageUrl"
      action="/api/upload"
      :headers="uploadHeaders"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '',
      uploadHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    };
  },
  methods: {
    handleUploadSuccess(response, file, fileList) {
      console.log('上传成功：', response);
    }
  }
};
</script>
```

#### 多图上传

```vue
<template>
  <image-uploader
    v-model="imageUrls"
    action="/api/upload"
    :multiple="true"
    :limit="5"
  />
</template>

<script>
export default {
  data() {
    return {
      imageUrls: []
    };
  }
};
</script>
```

#### 自定义校验

```vue
<template>
  <image-uploader
    v-model="imageUrl"
    action="/api/upload"
    :max-size="2"
    :before-upload="handleBeforeUpload"
  />
</template>

<script>
export default {
  data() {
    return {
      imageUrl: ''
    };
  },
  methods: {
    handleBeforeUpload(file) {
      // 自定义校验逻辑
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('只能上传 JPG 格式的图片');
        return false;
      }
      return true;
    }
  }
};
</script>
```

#### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值（图片URL或URL数组） | string / array | — | — |
| action | 上传地址 | string | — | — |
| headers | 请求头 | object | — | {} |
| uploadData | 上传时附带的额外参数 | object | — | {} |
| name | 上传的文件字段名 | string | — | file |
| multiple | 是否支持多选 | boolean | — | false |
| limit | 最大上传数量 | number | — | 1 |
| listType | 列表类型 | string | text / picture / picture-card | picture-card |
| accept | 接受的文件类型 | string | — | image/jpeg,image/jpg,image/png,image/gif |
| maxSize | 文件大小限制（MB） | number | — | 5 |
| disabled | 是否禁用 | boolean | — | false |
| showTip | 是否显示提示 | boolean | — | true |
| tipText | 提示文本 | string | — | — |
| beforeUpload | 自定义上传前校验 | function | — | null |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 绑定值变化时触发 | 图片URL或URL数组 |
| success | 上传成功时触发 | response, file, fileList |
| error | 上传失败时触发 | err, file, fileList |
| exceed | 超出限制时触发 | files, fileList |
| remove | 删除文件时触发 | file, fileList |
| preview | 预览图片时触发 | file |

#### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearFiles | 清空文件列表 | — |

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 构建 ES Module 格式
npm run build:esm

# 构建 CommonJS 格式
npm run build:cjs

# 构建 UMD 格式
npm run build:umd
```

## 打包说明

本组件库使用 **Rollup** 进行打包，原因如下：

1. **更适合库打包**：Rollup 专为打包库而设计，生成的代码更简洁
2. **Tree-shaking 更好**：能更好地移除未使用的代码，减小包体积
3. **多种输出格式**：同时输出 ES Module、CommonJS、UMD 格式
4. **打包体积更小**：相比 webpack，打包的库体积更小
5. **配置更简单**：对于组件库场景，配置更直观

### 输出格式

- **ES Module** (`es/index.js`)：用于支持 tree-shaking 的现代构建工具
- **CommonJS** (`lib/index.js`)：用于 Node.js 环境和旧版构建工具
- **UMD** (`dist/index.js`)：用于浏览器直接引入

## 注意事项

1. 本组件库依赖 Vue2 和 Element UI，使用前请确保已安装这两个依赖
2. 组件库使用 `peerDependencies` 方式声明依赖，避免重复打包
3. 上传组件需要配置正确的上传接口地址和请求头
4. 商品选择器需要提供 `fetchData` 方法或 `data` 属性来获取数据

## License

MIT
