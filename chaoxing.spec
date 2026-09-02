# -*- mode: python ; coding: utf-8 -*-
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
    "pystray",
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
    a.binaries,
    a.datas,
    [],
    name="chaoxing-fanya",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon="fav.jpg",
)
