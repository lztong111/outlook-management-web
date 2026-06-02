# Outlook Mail Manager

Outlook/Hotmail 邮箱批量管理工具，支持多账户管理、邮件查看、Token 自动刷新等功能。

## 功能特性

- 📧 **多账户管理** - 批量导入、导出、编辑邮箱账户
- 📬 **邮件查看** - 支持收件箱、垃圾箱邮件查看
- 🔄 **Token 自动刷新** - 每 10 天自动刷新所有账户的 Refresh Token
- 🏷️ **标签系统** - 支持为邮箱添加自定义标签
- 🔐 **安全认证** - 登录密码保护，未登录无法访问
- 🌙 **暗色模式** - 支持亮色/暗色/跟随系统主题
- 📱 **响应式设计** - 支持桌面端和移动端

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + Vite + Tailwind CSS + Zustand |
| 后端 | Node.js + Koa 3 + TypeScript |
| 数据库 | SQLite (better-sqlite3) |
| 邮件协议 | Microsoft Graph API + IMAP (XOAUTH2) |

## 环境要求

- **Node.js** >= 18.x（推荐 20.x 或 22.x LTS）
- **npm** >= 9.x
- **操作系统** - Windows / macOS / Linux

> ⚠️ **注意**：Node.js 24.x 可能存在兼容性问题，建议使用 20.x 或 22.x LTS 版本。

## 安装部署

### 1. 克隆项目

```bash
git clone <repository-url>
cd outlook-mail-manager
```

### 2. 安装依赖

```bash
npm run install:all
```

该命令会自动安装根目录、server、web 三个目录的依赖。

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务端口
PORT=3000

# 日志级别
LOG_LEVEL=info

# 数据库路径（相对于 server/）
DB_PATH=./data/outlook.db

# 访问密码（必填，留空则自动生成随机密码）
ACCESS_PASSWORD=your_password_here
```

### 4. 启动项目

#### 开发模式

```bash
npm run dev
```

启动后访问：
- 前端：http://localhost:5173
- 后端：http://localhost:3000

#### 生产模式

```bash
# 构建前端
npm run build

# 启动服务
npm start
```

启动后访问：http://localhost:3000

## 邮箱格式

支持以下格式的邮箱数据导入：

```
email----password----client_id----refresh_token
```

示例：
```
user@outlook.com----password123----9e5f94bc-e8a4-4e73-b8be-63364c29d753----M.C547_SN1.0.U-xxx...
```

### 导入方式

1. **文件导入** - 支持 `.txt` / `.csv` 文件，自动检测分隔符
2. **粘贴导入** - 直接粘贴文本内容，自动去除 `[Pasted ~1 lines]` 等前缀

## Token 刷新策略

| 类型 | 频率 | 说明 |
|------|------|------|
| 自动刷新 | 每 10 天 | 后台定时任务，启动后 5 分钟首次执行 |
| 手动刷新 | 随时 | 仪表盘点击"刷新 Token"按钮 |
| 被动刷新 | 用户操作时 | 收取邮件时自动刷新 |

## 目录结构

```
outlook-mail-manager/
├── server/                 # 后端服务
│   ├── src/
│   │   ├── config/        # 配置
│   │   ├── controllers/   # 控制器
│   │   ├── database/      # 数据库
│   │   ├── middlewares/    # 中间件
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── services/      # 业务逻辑
│   │   ├── types/         # 类型定义
│   │   └── utils/         # 工具函数
│   └── data/              # SQLite 数据库文件
├── web/                    # 前端应用
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── lib/           # 工具库
│   │   ├── pages/         # 页面
│   │   ├── stores/        # 状态管理
│   │   └── types/         # 类型定义
│   └── dist/              # 构建产物
├── .env                    # 环境变量
├── .env.example            # 环境变量示例
└── package.json            # 根配置
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 登录 |
| `/api/auth/check` | GET | 检查认证状态 |
| `/api/accounts` | GET | 获取账户列表 |
| `/api/accounts` | POST | 创建账户 |
| `/api/accounts/:id` | PUT | 更新账户 |
| `/api/accounts/:id` | DELETE | 删除账户 |
| `/api/accounts/import` | POST | 导入账户 |
| `/api/accounts/export` | POST | 导出账户 |
| `/api/mails/fetch` | POST | 获取邮件 |
| `/api/mails/cached` | GET | 获取缓存邮件 |
| `/api/tokens/refresh` | POST | 手动刷新 Token |
| `/api/dashboard/stats` | GET | 仪表盘统计 |

## 常见问题

### Q: 启动时报错 `better-sqlite3` 相关错误？

A: 需要重新编译原生模块：
```bash
cd server
npm rebuild better-sqlite3
```

### Q: Node.js 版本不兼容？

A: 建议使用 Node.js 20.x 或 22.x LTS 版本：
```bash
# 使用 nvm 切换版本
nvm install 22
nvm use 22
```

### Q: 登录密码忘记了？

A: 删除 `.env` 文件中的 `ACCESS_PASSWORD` 配置，重启服务后会在控制台打印新的随机密码。

### Q: 邮件收取失败？

A: 检查以下几点：
1. Refresh Token 是否有效
2. 网络连接是否正常
3. 是否需要配置代理

## 许可证

MIT License
