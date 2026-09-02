# -*- mode: python ; coding: utf-8 -*-
# Electron 后端专用 spec (独立 exe 版本见 chaoxing.spec，注意同步 datas/hiddenimports)
# 主要差异：console=True (支持 stdin/stdout 管道), 移除 pystray, name=chaoxing-backend
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

datas = [
    ("web/dist", "web/dist"),
    ("resource", "resource"),
    ("config.ini.example", "."),
    ("fav.jpg", "."),
]
datas += collect_data_files("ddddocr")

hiddenimports = [
    "flask_cors",
    "loguru",
    "pyaes",
    "bs4",
    "lxml",
    "openai",
    "httpx",
    "ddddocr",
    "onnxruntime",
    "PIL",
    "numpy",
    "cv2",
    "tqdm",
    "fontTools",
    "requests",
    "urllib3",
    # 移除 pystray - Electron 无头模式不需要托盘图标
]
hiddenimports += collect_submodules("api")

a = Analysis(
    ["app.py"],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=["paddleocr", "paddlepaddle", "PaddleOCR", "celery"],
    noarchive=False,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,  # onedir 模式：二进制文件由 COLLECT 处理
    name="chaoxing-backend",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=True,  # console=True 确保 stdin/stdout 管道可用
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon="fav.jpg",
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=False,
    upx_exclude=[],
    name="chaoxing-backend",
)
