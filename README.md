# 超星学习通自动化工具

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/RRRRUDDDD/chaoxing-gui)](https://github.com/RRRRUDDDD/chaoxing-gui)
[![License](https://img.shields.io/github/license/RRRRUDDDD/chaoxing-gui)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)

**带 Web 界面的超星学习通自动学习工具**

视频学习 · 自动答题 · 进度推送

</div>

---

## 快速开始

### 方式一：一键启动（推荐新手）

```bash
# 1. 下载项目
git clone https://github.com/RRRRUDDDD/chaoxing-gui.git
cd chaoxing-gui

# 2. 启动
start.bat  # Windows 双击或命令行运行

# 3. 打开浏览器访问 http://localhost:3000
```

**自动完成**：检查环境 → 安装依赖 → 启动服务 → 打开浏览器

### 方式二：桌面应用（免命令行）

```bash
# 构建桌面版（只需一次）
build_desktop.bat

# 双击安装
desktop/release/chaoxing-gui-desktop-Setup-*.exe
```

安装后通过开始菜单或桌面快捷方式启动。

### 方式三：命令行模式

```bash
# 使用配置文件
python main.py -c config.ini

# 命令行参数
python main.py -u 手机号 -p 密码 -l 课程ID --speed 1.5
```

---

## 使用说明

### 1. 登录

**Web UI**：
- 输入手机号和密码，点击"登录"
- 或上传 `cookies.txt` 文件

**CLI**：
- 编辑 `config.ini` 填写账号信息
- 或使用 `-u` `-p` 参数

### 2. 选择课程

**Web UI**：点击课程卡片选中（不选则学习全部）

**CLI**：使用 `-l` 参数指定课程 ID，逗号分隔

### 3. 配置参数（可选）

- **播放倍速**：1.0-2.0，建议 1.5
- **并发章节**：1-10，建议 3-5
- **题库**：支持言溪/Like/AI 等 5 种题库
- **通知**：支持 Server酱/Telegram/Bark 等

### 4. 开始学习

**Web UI**：点击"开始学习"，查看实时进度

**CLI**：自动运行，查看控制台输出

---

## 核心功能

- ✅ **视频自动播放**：支持倍速（1.0-2.0x）
- ✅ **题库自动答题**：内置 5 大题库，覆盖率可配置
- ✅ **OCR 识别**：本地 PaddleOCR 或云端视觉模型
- ✅ **进度推送**：Server酱/Telegram/Bark/Qmsg
- ✅ **可视化界面**：Web UI + 桌面应用

---

## 常见问题

### 端口被占用

```bash
# 查看占用进程
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# 结束进程
taskkill /F /PID <进程ID>
```

### 依赖安装失败

```bash
# 清理缓存
pip cache purge
pip install -r requirements.txt --force-reinstall

# 使用国内镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 题库无响应

1. 检查 token 是否正确
2. 查看 `logs/chaoxing.log` 确认错误
3. 降低 `cover_rate` 参数（如 0.6）
4. 切换其他题库提供商

### 登录失败

- 检查账号密码是否正确
- Cookie 可能已过期，重新获取
- 部分账号触发验证码（暂不支持）

更多问题见 [GitHub Issues](https://github.com/RRRRUDDDD/chaoxing-gui/issues)

---

## 配置示例

`config.ini` 基本配置：

```ini
[account]
username = 13800138000
password = your_password

[study]
speed = 1.5           # 播放倍速
max_workers = 3       # 并发章节数
notopen_action = retry  # 未开放章节：retry/continue/ask

[tiku]
provider = Yanxi      # 题库：Yanxi/Like/AI/SiliconFlow/TikuAdapter
yanxi_token = your_token
cover_rate = 0.8      # 覆盖率：0.0-1.0
submit = true         # 自动提交答案

[notify]
provider = ServerChan  # 通知：ServerChan/Telegram/Bark/Qmsg
serverchan_key = SCT123456789ABCDEF
```

完整配置见 `config_template.ini`

---

## 部署方式

| 方式 | 适用场景 | 特点 |
|-----|---------|-----|
| **一键启动** | 临时使用 | 最快上手，每次启动 |
| **桌面应用** | 长期使用 | 独立窗口，后台运行 |
| **Docker** | 服务器部署 | 环境隔离，易迁移 |
| **便携包** | 分发给他人 | 免安装，解压即用 |
| **命令行** | 定时任务 | 脚本化，自动化 |

### Docker 部署

```bash
docker build -t chaoxing-gui .

# 使用默认配置
docker run -it chaoxing-gui

# 挂载自定义配置
docker run -it -v $(pwd)/config.ini:/config/config.ini chaoxing-gui
```

### 便携打包

```bash
clean_and_build_portable.bat  # 生成 chaoxing_portable 目录
```

复制整个目录到任意位置，双击 `start.bat` 即可使用。

---

## 许可与免责

### 开源许可

GPL-3.0 许可证 — 允许自由使用和修改，但衍生项目必须开源

### 免责声明

**本项目仅供学习交流**

- ⚠️ 使用者自行承担所有法律责任
- ⚠️ 严禁用于作弊、刷分等违反学术诚信的行为
- ⚠️ 账号安全、学习记录等风险自负
- ⚠️ 开发者不对任何后果负责

**使用即表示同意上述条款**

---

## 致谢与支持

基于 [Samueli924/chaoxing](https://github.com/Samueli924/chaoxing) 核心逻辑开发

- [报告问题](https://github.com/RRRRUDDDD/chaoxing-gui/issues)
- [功能建议](https://github.com/RRRRUDDDD/chaoxing-gui/issues)
- [技术交流](https://github.com/RRRRUDDDD/chaoxing-gui/discussions)

如果有帮助，欢迎 Star ⭐

---

<div align="center">

**Made with ❤️ by the Open Source Community**

</div>
