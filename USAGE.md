# 使用文档

## 安装

```bash
npm install @company/element-business-components
# 或
yarn add @company/element-business-components
# 或
pnpm add @company/element-business-components
```

## 快速开始

### 完整引入

```js
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ElementBusinessComponents from '@company/element-business-components';

Vue.use(ElementUI);
Vue.use(ElementBusinessComponents);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

### 按需引入（推荐）

```js
import Vue from 'vue';
import { ProductSelector, ImageUploader } from '@company/element-business-components';

Vue.component('ProductSelector', ProductSelector);
Vue.component('ImageUploader', ImageUploader);

// 或者在组件中局部注册
export default {
  components: {
    ProductSelector,
    ImageUploader
  }
};
```

### CDN 引入

```html
<!-- 引入 Vue -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
<!-- 引入 Element UI -->
<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<!-- 引入组件库 -->
<script src="https://unpkg.com/@company/element-business-components/dist/index.js"></script>

<script>
  Vue.use(ElementBusinessComponents);
</script>
```

## 组件文档

### ProductSelector 商品选择器

用于选择商品的业务组件，支持单选和多选，支持搜索和分页。

#### 基础用法

```vue
<template>
  <div>
    <product-selector
      v-model="selectedProduct"
      :fetch-data="fetchProducts"
      @change="handleChange"
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
    async fetchProducts(params) {
      // 调用后端接口获取商品列表
      const response = await this.$http.get('/api/products', { params });
      return {
        list: response.data.list,
        total: response.data.total
      };
    },
    handleChange(product) {
      console.log('选中的商品:', product);
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
    :fetch-data="fetchProducts"
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
        { productId: 1, productName: '商品A', productCode: 'A001', price: 100, stock: 50 },
        { productId: 2, productName: '商品B', productCode: 'B001', price: 200, stock: 30 }
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
| fetchData | 获取数据的方法 | function(params) | — | null |
| valueKey | 值的键名 | string | — | productId |
| labelKey | 显示的键名 | string | — | productName |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 选中值改变时触发 | 单选：选中的商品对象；多选：选中的商品数组 |
| input | 绑定值改变时触发 | 单选：商品ID；多选：商品ID数组 |

---

### ImageUploader 图片上传

用于上传图片的业务组件，支持单图和多图上传，支持预览和删除。

#### 基础用法

```vue
<template>
  <div>
    <image-uploader
      v-model="imageUrl"
      action="/api/upload"
      :headers="uploadHeaders"
      @success="handleSuccess"
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
    handleSuccess(response, file, fileList) {
      this.$message.success('上传成功');
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
    :before-upload="handleBeforeUpload"
    :max-size="2"
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
| action | 上传地址（必填） | string | — | — |
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
| beforeUpload | 自定义上传前校验 | function(file) | — | null |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 绑定值改变时触发 | 单图：图片URL；多图：图片URL数组 |
| input | 绑定值改变时触发 | 单图：图片URL；多图：图片URL数组 |
| success | 上传成功时触发 | (response, file, fileList) |
| error | 上传失败时触发 | (err, file, fileList) |
| exceed | 超出限制时触发 | (files, fileList) |
| remove | 删除文件时触发 | (file, fileList) |
| preview | 预览图片时触发 | (file) |

#### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearFiles | 清空文件列表 | — |

## TypeScript 支持

本组件库提供了完整的 TypeScript 类型定义。

```typescript
import { ProductSelector, ImageUploader } from '@company/element-business-components';
import type { ProductSelectorProps, ImageUploaderProps } from '@company/element-business-components';

// 使用类型
const props: ProductSelectorProps = {
  multiple: true,
  placeholder: '请选择商品'
};
```

## 常见问题

### 1. 如何自定义样式？

组件使用了 scoped 样式，如果需要覆盖样式，可以使用深度选择器：

```css
/* Vue 2 */
.my-component >>> .product-selector {
  /* 自定义样式 */
}

/* 或使用 /deep/ */
.my-component /deep/ .product-selector {
  /* 自定义样式 */
}
```

### 2. 上传组件如何处理后端返回格式？

默认情况下，组件会从 `response.data.url` 或 `response.url` 获取图片地址。如果后端返回格式不同，可以监听 `success` 事件自行处理：

```vue
<image-uploader
  v-model="imageUrl"
  action="/api/upload"
  @success="handleSuccess"
/>

<script>
export default {
  methods: {
    handleSuccess(response, file, fileList) {
      // 自定义处理逻辑
      const url = response.result.imageUrl;
      this.imageUrl = url;
    }
  }
};
</script>
```

### 3. 商品选择器如何自定义表格列？

目前组件内置了固定的表格列。如果需要自定义，建议基于源码进行二次开发，或者提交 Issue 反馈需求。

## 版本管理

### 发布新版本

```bash
# 补丁版本（bug 修复）1.0.0 -> 1.0.1
npm run release:patch

# 次版本（新功能）1.0.0 -> 1.1.0
npm run release:minor

# 主版本（破坏性更新）1.0.0 -> 2.0.0
npm run release:major
```

### 手动发布

```bash
# 1. 构建
npm run build

# 2. 更新版本号
npm version patch  # 或 minor / major

# 3. 发布到 npm
npm publish
```

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build
```

### 添加新组件

1. 在 `packages/components/` 下创建组件目录
2. 创建 `index.vue` 和 `index.js` 文件
3. 在 `packages/index.js` 中导出组件
4. 在 `types/` 下添加类型定义
5. 更新文档

## 许可证

MIT License

## 联系方式

- Issues: https://github.com/Mr-Shi-root/element-doc/issues
- Email: your-email@example.com
