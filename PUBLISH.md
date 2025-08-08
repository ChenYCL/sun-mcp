# 发布指南

## 🚀 发布到npm

### 1. 准备发布

```bash
# 构建项目
npm run build

# 检查文件
npm pack --dry-run
```

### 2. 登录npm

```bash
npm login
```

### 3. 发布

```bash
npm publish
```

## 📦 用户使用方式

发布后，用户可以在Claude Desktop中使用Easy MCP Installation：

- **Name**: `Sun MCP`
- **Command**: `npx -y sun-mcp@latest`

## 🔄 版本更新

### 更新版本号

```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 小版本 (1.0.0 -> 1.1.0)
npm version minor

# 大版本 (1.0.0 -> 2.0.0)
npm version major
```

### 发布新版本

```bash
npm publish
```

## 📋 发布检查清单

- [ ] 代码已提交到 Git
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] 构建成功
- [ ] npm 登录状态正常

## 🌟 优势

发布到 npm 后，用户可以：

1. **简单安装**: 使用 npx 直接运行，无需本地构建
2. **自动更新**: 使用`@latest`标签自动获取最新版本
3. **Easy MCP**: 支持 Claude Desktop 的一键安装功能
4. **全球可用**: 任何人都可以通过 npm 安装使用

## 📊 使用统计

发布后可以在以下地方查看使用统计：

- npm 包页面: `https://www.npmjs.com/package/sun-mcp`
- 下载统计: `https://npm-stat.com/charts.html?package=sun-mcp`

## 🔧 故障排除

### 发布失败

1. 检查包名是否已被占用
2. 确认 npm 登录状态
3. 检查 package.json 格式
4. 确认构建文件存在

### 用户安装问题

1. 确认 Node.js 版本 >= 18
2. 检查网络连接
3. 尝试清除 npm 缓存: `npm cache clean --force`
