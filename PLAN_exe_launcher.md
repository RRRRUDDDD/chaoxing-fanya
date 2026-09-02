# 计划：chaoxing.exe 启动器 + 便携运行库

## 目标形态

把现有「便携版目录 + .bat 入口」升级为「便携版目录 + 单一 chaoxing.exe 入口」。
运行库（嵌入式 Python + 依赖 + 前端 dist + 源码）保持目录形式，**不打进 exe**。

最终分发目录：
```
chaoxing_portable/
├── chaoxing.exe        ← 唯一入口，双击即用（无窗口后台运行）
├── python/             ← 嵌入式 Python + 依赖（build_portable.bat 产出）
├── web/dist/           ← 前端构建产物
├── api/  resource/  PaddleOCR/  app.py  main.py  ...
├── logs/               ← 启动器自动创建，存放后端日志
└── config.ini
```

## 已确认决策

- 形态：exe 启动器 + 运行库目录（非 PyInstaller onefile 大包）
- 控制台：**无窗口后台运行**（--windowed），日志写入 `logs/backend.log`
- 端口占用：**复用已运行实例**——检测到 5000 已被监听则直接开浏览器，不重复启动

## 新增文件

### 1. `launcher.py`（约 130 行，无第三方依赖，仅用标准库）

职责：





1. 定位 `os.path.dirname(sys.executable)`（冻结后）或脚本目录（开发时）作为根目录
2. 拼接 `python/pythonw.exe`（优先，无窗口）或 `python/python.exe`，以及 `app.py`
3. 设置环境变量 `CHAOXING_ENABLE_OCR=1`、`PYTHONIOENCODING=utf-8`
4. 端口检测：尝试连接 `127.0.0.1:5000`
   - 已监听 → 直接 `webbrowser.open`，写一行日志后退出
   - 未监听 → 启动后端子进程
5. 启动后端：`subprocess.Popen`，stdout/stderr 追加写入 `logs/backend.log`，
   用 `CREATE_NO_WINDOW` / `DETACHED_PROCESS` 标志实现无窗口
6. 就绪轮询：最多等待 ~30s，每 0.5s 探测端口，就绪后 `webbrowser.open("http://localhost:5000")`
7. 异常处理：
   - 缺少 `python/` 或 `app.py` → `ctypes.windll.user32.MessageBoxW` 弹中文错误框
   - 后端启动后 30s 未就绪 → 弹框提示查看 `logs/backend.log`
8. 启动器自身异常也写入 `logs/launcher.log`

### 2. `build_exe.bat`（打包启动器）

- 用**本机** Python（非嵌入式）安装 pyinstaller（若未装）
- 执行：`pyinstaller --onefile --windowed --name chaoxing launcher.py`
- 产出 `dist/chaoxing.exe`
- 说明：启动器本身无重依赖，onefile 体积小（~10MB）、启动快、误报率低

## 修改现有文件

### `build_portable.bat`（仅末尾追加一步）

在「创建启动脚本」之后追加：
- 调用 `build_exe.bat`（或内联 pyinstaller 命令）生成 `chaoxing.exe`
- 将 `chaoxing.exe` 拷贝到 `%DIST_DIR%\`
- 保留原有 `.bat` 入口作为备用（不删除，向后兼容）

## 不改动

- `app.py` / `main.py` / `api/` 全部源码逻辑
- 前端 `web/`
- 现有 `.bat` 启动脚本（保留为备用入口）

## 验证步骤

1. 运行 `build_portable.bat` 产出完整目录（含新 exe）
2. 双击 `chaoxing.exe`：无窗口、自动开浏览器、页面正常加载
3. 再次双击：复用实例，不重复启动后端
4. 检查 `logs/backend.log` 有正常输出
5. 删掉 `python/` 后双击：弹出中文错误提示框
6. 任务管理器确认后端 python 进程随exe启动、可被正常结束

## 风险与备注

- 无窗口模式下后端崩溃用户无感知 → 靠 `logs/backend.log` + 启动器就绪超时弹框兜底
- 嵌入式 Python 的 `pythonw.exe` 需确认存在于发行包；若缺失则回退 `python.exe` + `CREATE_NO_WINDOW`
- exe 无数字签名，首次运行 SmartScreen 可能提示「未知发布者」，属正常现象
