# Electron 桌面版开发指南

## 概述

超星泛雅刷课助手现在支持三种发行形态：

1. **独立 exe**（原有）：`chaoxing.spec` → `dist/chaoxing-fanya.exe`，带托盘图标，自动打开系统浏览器
2. **便携版**（原有）：`build_portable.bat` → 嵌入式 Python + 启动脚本
3. **Electron 桌面版**（新增）：`desktop/` → 独立窗口，无需浏览器

## 架构

```
Electron 主进程 (main.js)
  ↓ spawn
  ├─ 后端子进程 (chaoxing-backend.exe / python app.py)
  │   ├─ Flask API (127.0.0.1:动态端口)
  │   └─ stdin watchdog (父进程退出时自动退出)
  └─ BrowserWindow
      └─ loadURL('http://127.0.0.1:{port}')
```

### 关键特性

- **动态端口**：Electron 分配空闲端口，通过 `CHAOXING_PORT` 环境变量传递给后端
- **孤儿进程防护**：后端监听 stdin EOF，父进程退出时自动终止
- **单实例锁**：`app.requestSingleInstanceLock()` 确保只运行一个实例
- **零前端改动**：前端仍通过相对路径 `/api/*` 调用后端

## 开发模式

### 启动完整开发环境

```bash
# 1. 后端开发
python app.py
# 访问 http://localhost:5000

# 2. 前端开发（热重载）
cd web && npm run dev
# 访问 http://localhost:3000（代理到后端 5000）

# 3. Electron 桌面开发（使用开发态后端 + 构建后的前端）
cd desktop && npm run dev
# Electron 窗口加载 http://127.0.0.1:{动态端口}
```

**注意**：
- Electron `npm run dev` 会启动 `python app.py`（开发模式），不支持前端热重载
- 前端迭代用 `web/npm run dev`；桌面窗口迭代用 `desktop/npm run dev`

## 构建生产版本

### 一键构建（推荐）

```bash
build_desktop.bat
```

**输出**：
- `desktop/release/chaoxing-fanya-desktop-*.exe`（NSIS 安装包）
- `desktop/release/chaoxing-fanya-desktop-*-portable.exe`（绿色便携版）

### 分步构建

```bash
# 1. 构建前端
cd web && npm ci && npm run build

# 2. 构建后端 exe（无头模式专用）
pyinstaller --clean --noconfirm chaoxing-backend.spec

# 3. 复制后端到 Electron 资源目录
xcopy /E /I /Y dist\chaoxing-backend.exe desktop\backend\

# 4. 构建 Electron 应用
cd desktop && npm ci && npx electron-builder --win
```

## 环境变量说明

后端 `app.py` 识别以下环境变量：

| 变量 | 值 | 作用 |
|------|---|------|
| `CHAOXING_HEADLESS` | `1` | 启用无头模式：绑定 127.0.0.1、禁用托盘、禁用 webbrowser.open、启用 stdin 守护 |
| `CHAOXING_PORT` | 整数 | Flask 监听端口，默认 `5000` |

**向后兼容**：
- 不设置环境变量 → 行为与原有完全一致（独立 exe 带托盘 + 浏览器）
- 开发模式 `python app.py` → 默认 5000 端口，无托盘，不自动开浏览器

## 文件清单

### 新增文件

```
desktop/
├── main.js                    # Electron 主进程
├── package.json               # Electron 依赖
├── electron-builder.yml       # 打包配置
├── build/icon.png             # 应用图标（512x512）
└── .gitignore

chaoxing-backend.spec          # 无头后端构建配置（console=True）
build_desktop.bat              # 一键构建脚本
```

### 修改文件

```
app.py                         # 新增 HEADLESS 模式支持（43-46, 617-627, 647-678 行）
.gitignore                     # 排除 desktop/node_modules, desktop/backend, desktop/release
```

## 常见问题

### Q1: 为什么需要两个 spec 文件？

- `chaoxing.spec`（原有）：独立 exe，`console=False`，带托盘图标
- `chaoxing-backend.spec`（新增）：Electron 后端，`console=True`，确保 stdin/stdout 可用

### Q2: 为什么后端要 `console=True`？

`console=True` 确保 `sys.stdin` 是真实管道句柄，而非 `None`。Electron 通过 `stdin.end()` 通知后端退出。

### Q3: 安装包体积多大？

- NSIS 安装包：~140 MB（压缩）
- 安装后体积：~250 MB（Electron 运行时 ~100 MB + PyInstaller 后端 ~150 MB）

### Q4: 如何调试后端日志？

**开发模式**：直接查看终端输出
**生产模式**：日志写入 `%APPDATA%\chaoxing-fanya\backend.log`

```powershell
Get-Content $env:APPDATA\chaoxing-fanya\backend.log -Tail 50 -Wait
```

### Q5: 端口冲突怎么办？

Electron 自动分配空闲端口，不会冲突。原有独立 exe 仍使用 5000，但支持实例复用（检测到 5000 占用时直接打开浏览器）。

## 测试清单

- [ ] 开发模式：`cd desktop && npm run dev` 窗口正常显示
- [ ] 生产构建：`build_desktop.bat` 无错误
- [ ] 安装：双击安装包，默认安装到 `C:\Users\<用户>\AppData\Local\Programs\超星泛雅刷课助手`
- [ ] 启动：桌面快捷方式启动，窗口显示登录界面
- [ ] 功能：登录 → 选课 → 开始学习，后台正常运行
- [ ] 关闭窗口：进程全部退出（Task Manager 检查无残留）
- [ ] 重复启动：二次启动聚焦第一个窗口，不创建新实例
- [ ] 配置持久化：`%APPDATA%\chaoxing-fanya\web_config.json` 保存用户配置
- [ ] 卸载：开始菜单卸载，程序文件和数据目录被清理

## 许可证

与主项目一致
