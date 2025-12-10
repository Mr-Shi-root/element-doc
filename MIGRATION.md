# 迁移指南

本文档记录了组件库各个版本之间的破坏性变更和迁移方法。

## 目录

- [从 1.x 迁移到 2.x](#从-1x-迁移到-2x)
- [从 0.x 迁移到 1.x](#从-0x-迁移到-1x)

---

## 从 1.x 迁移到 2.x

### 破坏性变更

#### ProductSelector

**1. `fetchData` 参数格式变更**

**之前 (v1.x):**
```js
fetchData(params) {
  // params: { keyword, page, pageSize }
  return { list: [], total: 0 };
}
```

**现在 (v2.x):**
```js
fetchData(params) {
  // params: { search, pagination: { page, pageSize } }
  return { data: [], total: 0 };
}
```

**迁移方法:**
```js
// 旧代码
async fetchData({ keyword, page, pageSize }) {
  const res = await api.getProducts({ keyword, page, pageSize });
  return { list: res.data, total: res.total };
}

// 新代码
async fetchData({ search, pagination }) {
  const res = await api.getProducts({
    keyword: search,
    page: pagination.page,
    pageSize: pagination.pageSize
  });
  return { data: res.data, total: res.total };
}
```

**2. 移除 `onSuccess` prop**

**之前 (v1.x):**
```vue
<product-selector :on-success="handleSuccess" />
```

**现在 (v2.x):**
```vue
<product-selector @success="handleSuccess" />
```

#### ImageUploader

**1. 移除 `uploadData` prop，改用 `data`**

**之前 (v1.x):**
```vue
<image-uploader :upload-data="{ token: 'xxx' }" />
```

**现在 (v2.x):**
```vue
<image-uploader :data="{ token: 'xxx' }" />
```

### 废弃警告

以下 API 在 v2.x 中仍可用，但会在控制台显示警告，将在 v3.0 中移除：

- `ProductSelector.valueKey` → 使用 `value-field` 代替
- `ImageUploader.tipText` → 使用 `tip` 代替

---

## 从 0.x 迁移到 1.x

### 破坏性变更

#### 全局

**1. 最低 Vue 版本要求**

- 之前: Vue 2.5+
- 现在: Vue 2.6+

**2. 最低 Element UI 版本要求**

- 之前: Element UI 2.13+
- 现在: Element UI 2.15+

---

## 渐进式迁移策略

如果项目较大，无法一次性完成迁移，可以采用以下策略：

### 1. 使用版本别名

```json
{
  "dependencies": {
    "@company/element-business-components": "^1.9.0",
    "@company/element-business-components-v2": "npm:@company/element-business-components@^2.0.0"
  }
}
```

```js
// 旧代码继续使用 v1
import { ProductSelector as ProductSelectorV1 } from '@company/element-business-components';

// 新代码使用 v2
import { ProductSelector as ProductSelectorV2 } from '@company/element-business-components-v2';
```

### 2. 分模块迁移

1. 先迁移新开发的模块
2. 再迁移使用频率低的模块
3. 最后迁移核心模块

### 3. 使用适配器模式

创建适配器组件，兼容新旧 API：

```vue
<!-- ProductSelectorAdapter.vue -->
<template>
  <product-selector-v2
    v-bind="adaptedProps"
    @success="handleSuccess"
  />
</template>

<script>
import { ProductSelector as ProductSelectorV2 } from '@company/element-business-components';

export default {
  name: 'ProductSelectorAdapter',
  components: { ProductSelectorV2 },
  props: {
    // 兼容旧 API
    onSuccess: Function,
    fetchData: Function
  },
  computed: {
    adaptedProps() {
      return {
        // 转换为新 API
        fetchData: this.adaptFetchData
      };
    }
  },
  methods: {
    adaptFetchData(params) {
      // 转换参数格式
      const oldParams = {
        keyword: params.search,
        page: params.pagination.page,
        pageSize: params.pagination.pageSize
      };

      return this.fetchData(oldParams).then(res => ({
        data: res.list,
        total: res.total
      }));
    },
    handleSuccess(data) {
      if (this.onSuccess) {
        this.onSuccess(data);
      }
      this.$emit('success', data);
    }
  }
};
</script>
```

---

## 自动化迁移工具

我们提供了自动化迁移脚本，可以帮助你快速完成大部分迁移工作：

```bash
# 安装迁移工具
npm install -g @company/element-business-components-migrate

# 运行迁移（从 v1 到 v2）
element-migrate --from=1 --to=2 --path=./src
```

迁移工具会自动：
- 替换废弃的 API
- 更新 import 语句
- 转换 props 和事件名称
- 生成迁移报告

**注意：** 迁移后请务必进行充分测试！

---

## 获取帮助

如果在迁移过程中遇到问题：

1. 查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细变更
2. 查看 [Issues](https://github.com/your-org/element-doc/issues) 搜索类似问题
3. 提交新的 Issue 寻求帮助
4. 联系组件库维护团队

---

## 版本支持策略

| 版本 | 状态 | 支持截止日期 | 说明 |
|------|------|-------------|------|
| 2.x | 活跃开发 | - | 当前主要版本 |
| 1.x | 维护模式 | 2025-12-31 | 只修复严重 bug |
| 0.x | 不再支持 | 2024-12-31 | 已停止维护 |

**维护模式说明：**
- 只修复严重的安全问题和 bug
- 不再添加新功能
- 建议尽快升级到最新版本
