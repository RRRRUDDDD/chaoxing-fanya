# 超星学习通自动化工具

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/RRRRUDDDD/chaoxing-gui)](https://github.com/RRRRUDDDD/chaoxing-gui)
[![GitHub Forks](https://img.shields.io/github/forks/RRRRUDDDD/chaoxing-gui)](https://github.com/RRRRUDDDD/chaoxing-gui)
[![License](https://img.shields.io/github/license/RRRRUDDDD/chaoxing-gui)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18.3-61dafb.svg)](https://react.dev/)

**Web UI + 桌面应用 + 命令行三端统一的自动化学习工具**

支持多题库、OCR 识别、多渠道通知推送

</div>

> 基于 [Samueli924/chaoxing](https://github.com/Samueli924/chaoxing) 核心逻辑开发，提供可视化界面和开箱即用体验

---

## ✨ 核心特性

### 🎨 可视化界面
- **Web UI**：React 前端，可视化配置、实时进度、日志流展示
- **桌面应用**：Electron 独立窗口，无需浏览器
- **响应式设计**：支持桌面和移动端访问

### 🚀 开箱即用
- **一键启动**：`start.bat` 自动检查依赖并启动服务
- **多种部署**：支持 Web、桌面版、Docker、便携包
- **零配置上手**：界面填写参数即可开始

### 🤖 智能题库
内置 5 大题库适配器：
- 言溪题库（TikuYanxi）
- LIKE 知识库（TikuLike）
- TikuAdapter（开源题库）
- AI 大模型（OpenAI 兼容）
- 硅基流动（SiliconFlow）

### 🔍 OCR 识别
- **本地方案**：PaddleOCR 3.7 离线识别
- **云端方案**：支持 OpenAI / Claude / Qwen / SiliconFlow 等视觉模型

### 📢 通知推送
任务完成或异常自动推送：Windows系统通知 / Server酱 / Qmsg / Bark / Telegram

---

## 🚀 快速开始

### ⚡ 最快上手方式（3 步）

```bash
# 1. 克隆项目
git clone --depth=1 https://github.com/RRRRUDDDD/chaoxing-gui
cd chaoxing-gui

# 2. 一键启动
start.bat  # Windows 双击或命令行运行

# 3. 打开浏览器
# 脚本会自动打开 http://localhost:3000
# 界面填写账号密码，点击开始学习
```

**脚本自动完成**：
- ✅ 检查 Python 3.8+ 和 Node.js 16+
- ✅ 安装后端依赖（`pip install -r requirements.txt`）
- ✅ 构建前端（`npm install && npm run build`）
- ✅ 启动 Flask 后端（`http://localhost:5000`）
- ✅ 自动打开浏览器访问 Web UI

---

### 🎯 更多启动方式

#### 方式一：Electron 桌面版（推荐新手）

**一次构建，永久使用**：

```bash
build_desktop.bat
```

**输出产物**：
- `desktop/release/chaoxing-gui-desktop-Setup-*.exe` — NSIS 安装包
  - 安装到 `C:\Program Files\chaoxing-gui-desktop\`
  - 自动创建开始菜单和桌面快捷方式
  
- `desktop/release/chaoxing-gui-desktop-*-portable.exe` — 绿色便携版
  - 解压到任意目录即可使用
  - 配置保存在程序目录下

**使用体验**：
```
双击桌面图标 → 独立窗口打开 → 登录配置 → 开始学习
```

**桌面版优势**：
- ✅ 原生窗口，无浏览器地址栏
- ✅ 后台运行，最小化到托盘
- ✅ 配置持久化（`%APPDATA%/chaoxing-gui-desktop/`）
- ✅ 单实例锁，防止多开冲突
- ✅ 动态端口分配，避免占用

详细说明见 [`desktop/README.md`](desktop/README.md)

#### 方式二：手动启动（开发调试）

**前后端分离启动**：

```bash
# 终端 1：后端
pip install -r requirements.txt
python app.py
# 后端运行在 http://localhost:5000

# 终端 2：前端（热重载）
cd web
npm install
npm run dev
# 前端运行在 http://localhost:3000，自动代理到后端 5000
```

**适用场景**：
- 开发调试
- 自定义端口
- 前端实时热重载

#### 方式三：Docker 容器化

**基础用法**：
```bash
docker build -t chaoxing-gui .

# 使用默认配置模板
docker run -it chaoxing-gui

# 挂载自定义配置
docker run -it -v $(pwd)/config.ini:/config/config.ini chaoxing-gui
```

**配置说明**：
- 首次运行自动将 `config_template.ini` 复制到 `/config/config.ini`
- 后续可通过 `-v` 挂载覆盖配置文件
- 容器内配置路径：`/config/config.ini`

#### 方式四：便携打包（免安装分发）

**构建便携版**：
```bash
clean_and_build_portable.bat
```

**输出目录结构**：
```
chaoxing_portable/
├── python/              # 嵌入式 Python 3.11 运行时
├── api/                 # 后端核心代码
├── web/dist/            # 前端构建产物
├── start.bat            # 启动脚本
└── config.ini           # 配置文件
```

**使用方式**：
1. 将整个 `chaoxing_portable` 目录复制到任意位置
2. 双击 `start.bat` 即可使用
3. 无需安装 Python 和 Node.js

**适用场景**：
- 分发给不懂技术的用户
- 多台电脑间快速迁移
- U 盘便携运行

#### 方式五：CLI 模式（脚本化）

**保留原项目的命令行方式**：

```bash
# 基础用法
python main.py -c config.ini

# 参数覆盖配置文件
python main.py -u 13800138000 -p password123 -l 123456,789012

# 完整参数示例
python main.py \
  -u 13800138000 \
  -p password123 \
  -l 123456,789012 \
  -a retry \
  --speed 1.5 \
  --max-workers 5 \
  --no-submit

# 查看所有参数
python main.py --help
```

**CLI 参数说明**：
- `-u, --username` — 手机号
- `-p, --password` — 密码
- `-l, --lessons` — 课程 ID 列表（逗号分隔）
- `-c, --config` — 配置文件路径
- `-a, --notopen-action` — 未开放章节处理：`retry`/`ask`/`continue`
- `--speed` — 播放倍速（1.0-2.0）
- `--max-workers` — 并发章节数（1-10）
- `--no-submit` — 禁用自动提交答案

**适用场景**：
- 定时任务（cron/Task Scheduler）
- CI/CD 集成
- 批量脚本处理

---

## ⚙️ 配置指南

### 配置文件位置

- **默认路径**：`config.ini`（项目根目录）
- **模板文件**：`config_template.ini`
- **Electron 版**：配置存储于 `%APPDATA%/chaoxing-gui-desktop/config.ini`

### 核心配置项

#### 登录方式

```ini
[common]
# 方式一：账号密码
username = 手机号
password = 密码

# 方式二：Cookie 文件（优先级更高）
# 将 cookies 保存到 cookies.txt，格式参考后端配置说明
```

#### 学习参数

```ini
[common]
speed = 1.5              # 播放倍速 (1.0-2.0)
max_workers = 3          # 并发章节数 (1-10)
notopen_action = retry   # 未开放章节处理策略：
                         # - retry: 延迟重试
                         # - ask: 询问用户
                         # - continue: 跳过继续
```

#### 题库配置

```ini
[tiku]
provider = Yanxi         # 题库提供商：Yanxi|Like|TikuAdapter|AI|SiliconFlow
cover_rate = 0.8         # 答题覆盖率 (0.0-1.0)，建议 0.6-0.9
submit = true            # 是否自动提交答案

# 言溪题库
yanxi_token = your_token

# LIKE 知识库
like_token = your_token
like_model = gpt-4

# TikuAdapter（开源题库）
tikuadapter_url = http://localhost:8080

# AI 大模型（OpenAI 兼容）
ai_endpoint = https://api.openai.com/v1
ai_key = sk-your-api-key
ai_model = gpt-4o

# 硅基流动
siliconflow_key = sk-your-api-key
siliconflow_model = Qwen/Qwen2.5-72B-Instruct
```

#### OCR 配置

**方案一：本地 PaddleOCR**（离线识别）

```bash
# 安装依赖
pip install paddlepaddle paddleocr>=3.7,<3.8

# 启用 OCR
export CHAOXING_ENABLE_OCR=1  # Linux/macOS
set CHAOXING_ENABLE_OCR=1     # Windows
```

**方案二：云端视觉模型**（推荐）

```bash
# OpenAI GPT-4V
export CHAOXING_VISION_OCR_PROVIDER=openai
export CHAOXING_VISION_OCR_KEY=sk-your-api-key
export CHAOXING_VISION_OCR_MODEL=gpt-4o

# Claude 3.5 Sonnet
export CHAOXING_VISION_OCR_PROVIDER=anthropic
export CHAOXING_VISION_OCR_KEY=sk-ant-your-api-key
export CHAOXING_VISION_OCR_MODEL=claude-3-5-sonnet-20241022

# Qwen VL（通义千问）
export CHAOXING_VISION_OCR_PROVIDER=qwen
export CHAOXING_VISION_OCR_KEY=sk-your-api-key
export CHAOXING_VISION_OCR_MODEL=qwen-vl-max

# 自定义 Endpoint（可选）
export CHAOXING_VISION_OCR_ENDPOINT=https://your-custom-endpoint.com/v1
export CHAOXING_VISION_OCR_PROMPT="自定义识别提示词"
```

#### 通知配置

```ini
[notify]
provider = ServerChan     # ServerChan|Qmsg|Bark|Telegram

# Server 酱
serverchan_key = SCT_your_key

# Qmsg 酱
qmsg_key = your_key

# Bark
bark_url = https://api.day.app/your_key

# Telegram
telegram_token = bot_token
telegram_chat_id = your_chat_id
```

### 完整配置示例

查看 [`config_template.ini`](config_template.ini) 获取带注释的完整配置模板

---

## 📖 使用流程

### Web UI 模式（推荐）

#### 第一步：启动服务

```bash
start.bat  # 或使用其他启动方式
```

等待脚本完成依赖检查和服务启动，浏览器会自动打开 `http://localhost:3000`

#### 第二步：登录认证

**方式一：账号密码登录**
1. 输入手机号和密码
2. 点击"登录"按钮
3. 系统自动验证并获取课程列表

**方式二：Cookie 登录**
1. 点击"使用 Cookie 登录"
2. 上传 `cookies.txt` 文件
3. 系统自动解析并获取课程列表

> **获取 Cookie**：浏览器 F12 → Network → 找到超星请求 → 复制 Cookie 字符串保存为 `cookies.txt`

#### 第三步：选择课程

- 查看所有可用课程卡片（显示课程名称、ID）
- 点击卡片选中目标课程（支持多选）
- **不选择**则默认学习所有课程

#### 第四步：配置参数

**基础配置**：
- **播放倍速**：1.0-2.0x，建议 1.5x
- **并发章节数**：1-10，建议 3-5
- **未开放章节处理**：
  - `retry` — 延迟重试（推荐）
  - `ask` — 询问用户
  - `continue` — 跳过继续

**题库配置**（可选）：
1. 选择题库提供商：Yanxi / Like / TikuAdapter / AI / SiliconFlow
2. 填写 Token / API Key
3. 设置覆盖率：0.6-0.9（建议 0.8）
4. 开启/关闭自动提交

**通知配置**（可选）：
1. 选择通知渠道：Server酱 / Qmsg / Bark / Telegram
2. 填写对应的 Token / Key / Chat ID

**OCR 配置**（可选）：
- 本地 PaddleOCR：需提前安装依赖
- 云端视觉模型：填写 API Key 和模型名称

#### 第五步：开始学习

1. 点击"开始学习"按钮
2. 界面显示：
   - 实时进度条（当前课程/总课程，当前章节/总章节）
   - 任务状态（学习中/已完成/错误）
   - 滚动日志输出（颜色标注不同日志级别）
3. 可随时点击"停止"按钮中断任务

#### 第六步：接收通知

- 任务完成：推送成功消息（学习总时长、完成课程数等）
- 发生异常：推送错误详情（错误类型、发生位置等）

---

### CLI 模式（命令行）

#### 基础用法

```bash
# 使用配置文件
python main.py -c config.ini

# 不指定配置文件则使用默认模板
python main.py
```

#### 参数覆盖

```bash
# 命令行参数优先级高于配置文件
python main.py \
  -c config.ini \
  -u 13800138000 \
  -p password123 \
  -l 123456,789012 \
  -a retry \
  --speed 1.5 \
  --max-workers 5
```

#### 定时任务示例

**Windows 任务计划程序**：
```batch
@echo off
cd /d "E:\chaoxing-gui"
python main.py -c config.ini >> logs\%date:~0,10%.log 2>&1
```

**Linux crontab**：
```bash
# 每天早上 8 点执行
0 8 * * * cd /home/user/chaoxing-gui && python main.py -c config.ini >> logs/$(date +\%Y-\%m-\%d).log 2>&1
```

---

## 🤖 进阶功能

### 题库配置详解

#### 支持的题库提供商

| 提供商 | 类型 | 配置项 | 特点 |
|--------|------|--------|------|
| **Yanxi** | 商业题库 | `yanxi_token` | 答案准确率高，需购买 token |
| **Like** | AI 知识库 | `like_token`, `like_model` | 支持多种 AI 模型 |
| **TikuAdapter** | 开源适配器 | `tikuadapter_url` | 可自建题库服务 |
| **AI** | OpenAI 兼容 | `ai_endpoint`, `ai_key`, `ai_model` | 支持 GPT-4/Claude/Qwen 等 |
| **SiliconFlow** | 硅基流动 | `siliconflow_key`, `siliconflow_model` | 国内可用，速度快 |

#### 覆盖率策略

```ini
[tiku]
cover_rate = 0.8  # 80% 的题目从题库获取，20% 空白提交
```

**推荐值**：
- 0.6-0.7 — 保守策略，降低被检测风险
- 0.8-0.9 — 平衡策略（推荐）
- 1.0 — 激进策略，100% 答题

**注意**：覆盖率过高可能触发平台风控

#### 自动提交控制

```ini
[tiku]
submit = true   # 自动提交答案
# submit = false  # 仅填入答案，不提交（可手动检查后提交）
```

### OCR 配置详解

#### 方案对比

| 方案 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **PaddleOCR** | 免费、离线、快速 | 准确率一般，需安装依赖 | 网络受限、成本敏感 |
| **GPT-4V** | 准确率极高，理解能力强 | 收费、需网络 | 复杂图片、公式识别 |
| **Claude 3.5** | 准确率高，速度快 | 收费、需网络 | 综合场景 |
| **Qwen VL** | 国内可用，价格低 | 准确率略低于 GPT-4V | 国内用户、成本敏感 |

#### 环境变量配置

**OpenAI GPT-4V**：
```bash
export CHAOXING_VISION_OCR_PROVIDER=openai
export CHAOXING_VISION_OCR_KEY=sk-proj-...
export CHAOXING_VISION_OCR_MODEL=gpt-4o
export CHAOXING_VISION_OCR_ENDPOINT=https://api.openai.com/v1  # 可选
```

**Claude 3.5 Sonnet**：
```bash
export CHAOXING_VISION_OCR_PROVIDER=anthropic
export CHAOXING_VISION_OCR_KEY=sk-ant-...
export CHAOXING_VISION_OCR_MODEL=claude-3-5-sonnet-20241022
```

**自定义提示词**：
```bash
export CHAOXING_VISION_OCR_PROMPT="请识别图片中的文字，只返回纯文本内容，不要添加任何解释。"
```

### 通知配置详解

#### Server 酱（推荐）

**获取 SendKey**：
1. 访问 https://sct.ftqq.com/
2. 微信登录并绑定
3. 复制 SendKey

**配置**：
```ini
[notify]
provider = ServerChan
serverchan_key = SCT123456789ABCDEF
```

#### Telegram Bot

**创建 Bot**：
1. Telegram 搜索 `@BotFather`
2. 发送 `/newbot` 创建机器人
3. 获取 Bot Token

**获取 Chat ID**：
1. 搜索 `@userinfobot`
2. 发送任意消息获取你的 Chat ID

**配置**：
```ini
[notify]
provider = Telegram
telegram_token = 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
telegram_chat_id = 123456789
```

#### Bark（iOS）

**安装 Bark App**：
1. App Store 搜索 "Bark"
2. 安装后打开，复制推送 URL

**配置**：
```ini
[notify]
provider = Bark
bark_url = https://api.day.app/your_device_key
```

---

## 📁 项目结构

```
chaoxing-gui/
├── api/                        # 后端核心模块
│   ├── base.py                # Chaoxing 核心类
│   ├── answer.py              # 题库适配器
│   ├── answer_check.py        # 答案校验
│   ├── vision_ocr.py          # OCR 引擎
│   ├── notification.py        # 通知推送
│   ├── logger.py              # 日志系统
│   └── ...
├── web/                        # React 前端
│   ├── src/
│   │   ├── App.jsx            # 主应用组件
│   │   ├── components/        # UI 组件
│   │   ├── api/               # API 封装
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── desktop/                    # Electron 桌面版
│   ├── main.js                # Electron 主进程
│   ├── preload.js             # 预加载脚本
│   ├── package.json
│   └── README.md
├── resource/                   # 静态资源
│   └── font_map_table.json    # 字体映射表
├── app.py                      # Flask 后端入口
├── main.py                     # CLI 入口
├── start.bat                   # 一键启动脚本
├── build_desktop.bat           # 桌面版构建脚本
├── clean_and_build_portable.bat # 便携版构建脚本
├── config_template.ini         # 配置模板
├── requirements.txt            # Python 依赖
├── Dockerfile                  # Docker 镜像
└── README.md                   # 本文档
```

---

## 🔧 常见问题

### 启动相关

#### Q: 端口被占用

**现象**：启动失败，提示端口 5000 或 3000 已被占用

**解决方案**：
```bash
# 查看占用进程
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# 结束占用进程（替换 <PID> 为实际进程 ID）
taskkill /F /PID <PID>

# 或修改端口
export CHAOXING_PORT=5001  # 后端端口
# 前端修改 web/vite.config.js 中的 server.port
```

#### Q: 浏览器未自动打开

**解决方案**：
1. 检查启动脚本输出，确认服务已正常启动
2. 手动访问 `http://localhost:3000`
3. 检查防火墙是否拦截
4. 尝试使用 `127.0.0.1:3000` 替代 `localhost`

#### Q: start.bat 提示找不到 Python

**解决方案**：
1. 确认已安装 Python 3.8+：`python --version`
2. 检查环境变量是否正确配置
3. 尝试使用 `py` 或 `python3` 命令
4. 重新安装 Python 并勾选 "Add to PATH"

---

### 依赖安装

#### Q: pip install 失败

**常见错误**：
```
ERROR: Could not find a version that satisfies the requirement...
```

**解决方案**：
```bash
# 清理缓存重装
pip cache purge
pip install -r requirements.txt --force-reinstall

# 使用国内镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 逐个安装排查
pip install flask
pip install requests
# ...
```

#### Q: npm install 卡住或失败

**解决方案**：
```bash
cd web

# 清理缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 使用国内镜像
npm install --registry=https://registry.npmmirror.com

# 或使用 yarn
yarn install
```

#### Q: PaddleOCR 安装失败

**解决方案**：
```bash
# CPU 版本（推荐）
pip install paddlepaddle -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install paddleocr>=3.7,<3.8

# GPU 版本（需 CUDA）
python -m pip install paddlepaddle-gpu -i https://mirror.baidu.com/pypi/simple
pip install paddleocr>=3.7,<3.8

# 验证安装
python -c "import paddleocr; print(paddleocr.__version__)"
```

---

### 功能相关

#### Q: 登录失败 / Cookie 失效

**可能原因**：
- 账号密码错误
- Cookie 已过期
- 触发验证码（暂不支持）

**解决方案**：
1. 检查账号密码是否正确
2. 重新获取 Cookie（浏览器登录后复制）
3. 尝试使用密码登录替代 Cookie

#### Q: 题库无返回结果

**排查步骤**：
1. 检查题库 token 是否正确
2. 查看后端日志确认请求状态：
   ```bash
   # 查看实时日志
   tail -f logs/chaoxing.log  # Linux
   type logs\chaoxing.log     # Windows
   ```
3. 确认题库服务可用性（访问官网测试）
4. 尝试降低 `cover_rate` 参数（如 0.6）
5. 切换其他题库提供商测试

#### Q: OCR 识别失败

**本地 PaddleOCR**：
```bash
# 检查安装
pip list | grep paddle

# 重新安装
pip install paddlepaddle paddleocr>=3.7,<3.8 --force-reinstall

# 验证环境变量
echo $CHAOXING_ENABLE_OCR  # 应输出 1（Linux/macOS）
echo %CHAOXING_ENABLE_OCR%  # 应输出 1（Windows）
```

**云端视觉模型**：
```bash
# 检查环境变量
echo $CHAOXING_VISION_OCR_PROVIDER
echo $CHAOXING_VISION_OCR_KEY

# 测试 API 连通性（OpenAI）
curl -H "Authorization: Bearer $CHAOXING_VISION_OCR_KEY" \
     https://api.openai.com/v1/models

# 测试 API 连通性（Claude）
curl -H "x-api-key: $CHAOXING_VISION_OCR_KEY" \
     https://api.anthropic.com/v1/messages
```

#### Q: 通知未推送

**排查步骤**：
1. 检查配置文件中 `provider` 和对应 token 是否正确
2. 测试通知服务：
   ```bash
   # Server 酱
   curl "https://sctapi.ftqq.com/SCT123456789ABCDEF.send?title=测试&desp=内容"
   
   # Bark
   curl "https://api.day.app/your_key/测试/内容"
   ```
3. 查看后端日志确认通知请求状态
4. 确认网络可访问通知服务

#### Q: 视频卡在某一章节不动

**可能原因**：
- 网络波动
- 视频加载失败
- 平台限制（需人工验证）

**解决方案**：
1. 查看日志确认卡住原因
2. 停止任务后重新开始（会自动跳过已完成章节）
3. 设置 `notopen_action=continue` 跳过问题章节
4. 手动完成该章节后继续

---

### 打包部署

#### Q: Docker 配置未生效

**检查步骤**：
1. 确认挂载路径正确：
   ```bash
   docker run -it -v $(pwd)/config.ini:/config/config.ini chaoxing-gui
   ```
2. 进入容器检查配置：
   ```bash
   docker exec -it <container_id> cat /config/config.ini
   ```
3. 确保配置文件权限正确（`chmod 644 config.ini`）

#### Q: Electron 桌面版无法启动

**检查项**：
1. 确认后端 exe 已正确打包：
   ```bash
   dir desktop\backend\chaoxing-backend.exe  # Windows
   ls -l desktop/backend/chaoxing-backend.exe  # Linux
   ```
2. 查看 Electron 日志：
   - Windows: `%APPDATA%\chaoxing-gui-desktop\logs\`
   - macOS: `~/Library/Application Support/chaoxing-gui-desktop/logs/`
   - Linux: `~/.config/chaoxing-gui-desktop/logs/`
3. 手动运行后端测试：
   ```bash
   cd desktop/backend
   ./chaoxing-backend.exe  # Windows
   ./chaoxing-backend      # Linux/macOS
   ```
4. 检查端口是否被占用（后端会尝试动态分配）

#### Q: 便携版打包后缺少文件

**解决方案**：
```bash
# 完整重新打包
clean_and_build_portable.bat

# 检查输出目录
dir chaoxing_portable  # 应包含 python/, api/, web/dist/ 等目录

# 手动补充缺失文件
xcopy /E /I /Y api chaoxing_portable\api
xcopy /E /I /Y web\dist chaoxing_portable\web\dist
```

---

### 性能优化

#### Q: 占用 CPU/内存过高

**优化建议**：
1. 降低并发章节数（`max_workers`）
2. 关闭不必要的功能（如 OCR、题库）
3. 使用命令行模式替代 Web UI
4. 检查是否有异常循环或卡死

#### Q: 学习速度太慢

**加速建议**：
1. 提高播放倍速（`speed`）至 2.0
2. 增加并发章节数（`max_workers`）至 5-10
3. 关闭题库自动提交（手动批量提交更快）
4. 使用有线网络替代 Wi-Fi

---

## 📚 扩展阅读

### 官方文档

- **[Web 功能清单](WEB_FEATURES.md)** — 完整的 Web UI 功能列表和使用说明
- **[前端开发指南](WEB_FRONTEND_GUIDE.md)** — 前端架构、组件设计和开发规范
- **[依赖清单](DEPENDENCIES.md)** — 详细的依赖版本、用途和安装说明
- **[桌面版说明](desktop/README.md)** — Electron 版本的架构、开发和构建指南

### 技术栈

**后端**：
- Python 3.8+ — 核心语言
- Flask 3.1+ — Web 框架
- Requests — HTTP 客户端
- BeautifulSoup4 — HTML 解析
- Loguru — 日志系统
- PaddleOCR — 本地 OCR（可选）

**前端**：
- React 18 — UI 框架
- Vite 5 — 构建工具
- TailwindCSS 3 — 样式框架
- Axios — HTTP 客户端
- Lucide React — 图标库

**桌面端**：
- Electron — 跨平台桌面应用框架
- electron-builder — 打包工具

### 贡献指南

欢迎提交 Issue 和 Pull Request！

**提交 Issue**：
1. 描述问题复现步骤
2. 附上错误日志和截图
3. 说明操作系统和 Python/Node.js 版本

**提交 PR**：
1. Fork 本项目
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交变更（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

---

## 🤝 致谢

### 原项目

感谢 [Samueli924/chaoxing](https://github.com/Samueli924/chaoxing) 的开创性工作，本项目保留了其核心自动化逻辑，专注于提升易用性和用户体验。

### 题库服务

- **言溪题库**（TikuYanxi） — 商业题库服务
- **LIKE 知识库**（TikuLike） — AI 驱动的题库
- **TikuAdapter** — 开源题库适配器项目

### 开源社区

- **React** — Facebook 开源的 UI 框架
- **Flask** — Pallets Projects 的轻量级 Web 框架
- **Electron** — OpenJS Foundation 的跨平台桌面框架
- **TailwindCSS** — Tailwind Labs 的实用优先 CSS 框架
- **PaddleOCR** — 百度飞桨的开源 OCR 工具

### 贡献者

感谢所有提交 Issue、PR 和建议的开发者，以及每一位使用者的反馈。

---

## 📄 许可与免责声明

### 开源许可

本项目采用 **GPL-3.0 许可证**：

✅ **允许**：
- 自由使用、复制、修改、分发
- 用于个人学习和研究
- 在相同许可证下再分发

❌ **禁止**：
- 闭源商业化（必须开源）
- 任何形式的盈利行为
- 移除或修改版权信息
- 授予专利许可

📋 **要求**：
- 衍生项目必须开源
- 必须使用 GPL-3.0 许可证
- 必须保留原作者版权声明
- 修改时需注明修改内容

详见 [LICENSE](LICENSE) 文件

### 免责声明

**本项目仅供学习交流使用**，请严格遵守以下原则：

#### 1. 法律与合规

- 使用者需**自行承担所有法律责任**
- 开发者**不对任何违法使用行为负责**
- 请遵守当地法律法规和平台服务条款

#### 2. 学术诚信

- **严禁**用于作弊、刷分等违反学术诚信的行为
- **严禁**用于替代正常学习过程
- 建议合理使用，辅助而非替代学习

#### 3. 合理使用

- 建议设置合理的倍速（≤1.5x）和并发（≤3）
- 避免对平台服务器造成过大压力
- 尊重教育资源，合理利用学习时间

#### 4. 风险提示

开发者**不对以下情况负责**：

- ❌ 账号被封禁、学习记录异常
- ❌ 因使用本工具导致的任何法律纠纷
- ❌ 第三方题库服务的可用性和准确性
- ❌ 数据丢失、隐私泄露等安全问题
- ❌ 因软件缺陷导致的学习进度问题
- ❌ 平台政策变更导致的功能失效

#### 5. 数据安全

- 本工具**不会**收集或上传用户数据
- 登录凭证仅存储在本地
- 建议使用**独立密码**，不要与其他账号共用
- Cookie 文件请妥善保管，避免泄露

#### 6. 使用建议

- **定期备份**学习进度和配置文件
- **测试环境**中先试运行，确认无误后正式使用
- **关注日志**输出，发现异常及时停止
- **理性对待**自动化工具，保持学习的主动性

---

**🔔 重要提示**

**使用本项目即表示您已阅读、理解并同意上述所有条款。**

如果您不同意上述条款，请立即停止使用本项目并删除所有相关文件。

---

## 🆚 同类工具对比

### vs 命令行工具（如 [Samueli924/chaoxing](https://github.com/Samueli924/chaoxing)）

| 特性 | 命令行工具 | 本项目 |
|------|-----------|--------|
| **上手难度** | 需要配置环境、编辑配置文件 | 一键启动，界面操作 |
| **配置方式** | 手动编辑 `.ini` 文件 | Web 表单 + 实时验证 |
| **进度查看** | 控制台文本滚动 | 实时进度条 + 日志面板 |
| **题库集成** | 需自己写代码对接 | 内置 5 种，下拉选择 |
| **通知推送** | 需自己实现 webhook | 内置 4 种渠道 |
| **多任务** | 需要脚本或多次运行 | 界面多选课程 |
| **适合人群** | 熟悉命令行的开发者 | 所有用户 |

**命令行工具优势**：轻量、脚本化、CI/CD 集成方便  
**本项目优势**：易用、直观、功能完整、开箱即用

---

### vs 浏览器扩展（如 OCS）

| 特性 | 浏览器扩展 | 本项目 |
|------|-----------|--------|
| **安装方式** | 浏览器扩展商店 | 独立程序 / Web 服务 |
| **运行环境** | 必须保持浏览器打开 | 后台运行，可关闭浏览器 |
| **功能完整度** | 受浏览器 API 限制 | 完整功能无限制 |
| **题库生态** | 通常单一或有限 | 5 种题库可选 |
| **稳定性** | 依赖浏览器更新，易失效 | 独立程序，稳定性高 |
| **定制性** | 扩展代码通常不开源 | 完全开源，可自由修改 |
| **适合场景** | 临时使用、轻量需求 | 长期使用、批量任务 |

**浏览器扩展优势**：安装简单、无需环境配置  
**本项目优势**：功能强大、后台运行、高度可定制

---

### 选择建议

- **新手 / 临时使用** → 浏览器扩展（最简单）
- **普通用户 / 长期使用** → 本项目桌面版（功能完整 + 易用）
- **技术用户 / 自动化需求** → 命令行工具或本项目 CLI 模式（灵活性高）
- **批量管理 / 多账号** → 本项目 Web UI + Docker（方便管理）

---

## 🤝 致谢

感谢 [Samueli924/chaoxing](https://github.com/Samueli924/chaoxing) 提供的核心自动化逻辑，以及所有开源社区的贡献者。

**技术栈**：
- 后端：Python、Flask、Requests、BeautifulSoup4、PaddleOCR
- 前端：React、Vite、TailwindCSS、Axios
- 桌面：Electron、electron-builder

---

## 📄 许可与免责声明

### 开源许可

本项目采用 **GPL-3.0 许可证**：

✅ **允许**：自由使用、修改、分发（需保持开源）  
❌ **禁止**：闭源商业化、任何盈利行为  
📋 **要求**：衍生项目必须使用 GPL-3.0 并开源

详见 [LICENSE](LICENSE) 文件

### 免责声明

**本项目仅供学习交流使用**

1. **法律责任**：使用者需自行承担所有法律责任
2. **学术诚信**：严禁用于作弊、刷分等违反学术诚信的行为
3. **合理使用**：建议合理设置倍速和并发，避免对平台造成压力
4. **风险自负**：账号安全、学习记录等风险由使用者自行承担

**开发者不对以下情况负责**：
- 账号被封禁、学习记录异常
- 因使用本工具导致的任何法律纠纷
- 第三方题库服务的可用性和准确性
- 数据丢失、隐私泄露等安全问题

**使用本项目即表示您已阅读并同意上述条款**

---

## 💬 社区与支持

- **GitHub Issues** — [报告 Bug](https://github.com/RRRRUDDDD/chaoxing-gui/issues)
- **GitHub Discussions** — [技术交流](https://github.com/RRRRUDDDD/chaoxing-gui/discussions)
- **扩展文档** — [Web 功能清单](WEB_FEATURES.md) · [依赖说明](DEPENDENCIES.md) · [桌面版指南](desktop/README.md)

---

## 🌟 Star History

如果这个项目对你有帮助，欢迎 Star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=RRRRUDDDD/chaoxing-gui&type=Date)](https://star-history.com/#RRRRUDDDD/chaoxing-gui&Date)

---
