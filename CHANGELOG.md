# Changelog

所有重要的变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 待发布的变更
- 无

## [1.0.0] - 2024-12-10

### 新增
- **[ProductSelector]** 商品选择器组件
  - 支持单选和多选模式
  - 支持搜索和分页
  - 支持静态数据和动态获取
- **[ImageUploader]** 图片上传组件
  - 支持单图和多图上传
  - 支持预览和删除
  - 自定义校验和大小限制

### 示例：未来的版本

## [1.1.0] - 2024-12-15

### 新增
- **[ProductSelector]** 新增 `customColumns` 属性，支持自定义表格列

### 修复
- **[ImageUploader]** 修复多图上传时删除错误的问题

## [1.0.1] - 2024-12-12

### 修复
- **[ProductSelector]** 修复搜索关键词为空时的报错问题

---

## 版本说明

- **[组件名]** 标记表示该变更影响的组件
- 如果变更影响所有组件，使用 **[All]** 标记
- 如果是基础设施变更（构建、文档等），使用 **[Infra]** 标记

## 变更类型

- **新增（Added）**：新功能
- **变更（Changed）**：现有功能的变更
- **废弃（Deprecated）**：即将移除的功能
- **移除（Removed）**：已移除的功能
- **修复（Fixed）**：Bug 修复
- **安全（Security）**：安全相关的修复
