# 发布指南

## 发布前检查清单

在发布新版本之前，请确保完成以下检查：

- [ ] 所有代码已提交到 Git
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新（如果有）
- [ ] 版本号符合语义化版本规范

## 快速发布

### 方式一：使用 npm scripts（推荐）

```bash
# 补丁版本（bug 修复）1.0.0 -> 1.0.1
npm run release:patch

# 次版本（新功能）1.0.0 -> 1.1.0
npm run release:minor

# 主版本（破坏性更新）1.0.0 -> 2.0.0
npm run release:major
```

这些命令会自动：
1. 更新 package.json 中的版本号
2. 执行 `npm run build` 构建项目
3. 创建 Git tag
4. 发布到 npm

### 方式二：手动发布

```bash
# 1. 确保代码已构建
npm run build

# 2. 登录 npm（首次发布需要）
npm login

# 3. 更新版本号
npm version patch  # 或 minor / major

# 4. 发布到 npm
npm publish

# 5. 推送到 Git（包括 tags）
git push && git push --tags
```

## 首次发布

如果是第一次发布组件库，需要完成以下步骤：

### 1. 注册 npm 账号

访问 https://www.npmjs.com/ 注册账号

### 2. 登录 npm

```bash
npm login
```

输入用户名、密码和邮箱。

### 3. 修改包名（如果需要）

如果包名 `@company/element-business-components` 已被占用，需要修改 [package.json](package.json) 中的 `name` 字段：

```json
{
  "name": "@your-org/element-business-components"
}
```

或者使用无作用域的包名：

```json
{
  "name": "your-element-business-components"
}
```

### 4. 发布

```bash
# 构建
npm run build

# 发布
npm publish
```

**注意**：如果使用作用域包名（如 `@company/xxx`），首次发布需要添加 `--access public` 参数：

```bash
npm publish --access public
```

## 发布到私有 npm 仓库

如果要发布到公司内部的私有 npm 仓库：

### 1. 配置 registry

```bash
# 临时设置
npm publish --registry=https://your-private-registry.com

# 或在 package.json 中配置
{
  "publishConfig": {
    "registry": "https://your-private-registry.com"
  }
}
```

### 2. 配置 .npmrc

在项目根目录创建 `.npmrc` 文件：

```
registry=https://your-private-registry.com
//your-private-registry.com/:_authToken=${NPM_TOKEN}
```

### 3. 发布

```bash
npm publish
```

## 版本号规范

遵循语义化版本控制（Semantic Versioning）：

- **主版本号（Major）**：不兼容的 API 修改
  - 例如：删除组件、修改 props 名称、修改事件名称
  - `1.0.0` -> `2.0.0`

- **次版本号（Minor）**：向后兼容的功能性新增
  - 例如：新增组件、新增 props、新增事件
  - `1.0.0` -> `1.1.0`

- **修订号（Patch）**：向后兼容的问题修正
  - 例如：bug 修复、样式调整、文档更新
  - `1.0.0` -> `1.0.1`

## 发布后验证

发布成功后，进行以下验证：

### 1. 检查 npm 包

```bash
# 查看包信息
npm view @company/element-business-components

# 查看包内容
npm view @company/element-business-components files
```

### 2. 在新项目中测试

```bash
# 创建测试项目
mkdir test-project && cd test-project
npm init -y

# 安装组件库
npm install @company/element-business-components

# 检查安装结果
ls node_modules/@company/element-business-components
```

### 3. 测试引入

创建测试文件 `test.js`：

```javascript
// ES Module
import { ProductSelector, ImageUploader } from '@company/element-business-components';
console.log(ProductSelector, ImageUploader);

// CommonJS
const components = require('@company/element-business-components');
console.log(components);
```

## 回滚版本

如果发布的版本有问题，可以使用 npm deprecate 标记为废弃：

```bash
# 标记某个版本为废弃
npm deprecate @company/element-business-components@1.0.1 "This version has bugs, please use 1.0.2"

# 取消发布（仅限发布后 72 小时内）
npm unpublish @company/element-business-components@1.0.1
```

**注意**：不建议使用 `unpublish`，因为会影响已经使用该版本的用户。

## 常见问题

### 1. 发布失败：403 Forbidden

**原因**：没有权限或包名已被占用

**解决**：
- 检查是否已登录：`npm whoami`
- 修改包名
- 如果是作用域包，添加 `--access public`

### 2. 发布失败：需要 2FA

**原因**：npm 账号开启了两步验证

**解决**：
- 在命令行输入 2FA 验证码
- 或使用 automation token

### 3. 包体积过大

**原因**：打包了不必要的文件

**解决**：
- 检查 [.npmignore](.npmignore) 配置
- 检查 package.json 中的 `files` 字段
- 使用 `npm pack` 预览打包内容

### 4. TypeScript 类型定义不生效

**原因**：types 路径配置错误

**解决**：
- 检查 package.json 中的 `types` 字段
- 确保 types 文件已打包到 npm

## 自动化发布（CI/CD）

### GitHub Actions 示例

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Publish
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

使用方式：

```bash
# 创建 tag 并推送
git tag v1.0.0
git push origin v1.0.0
```

## 相关链接

- [npm 官方文档](https://docs.npmjs.com/)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [npm 发布指南](https://docs.npmjs.com/cli/v8/commands/npm-publish)
